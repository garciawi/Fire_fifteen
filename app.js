// Citation for the following functions: SETUP, ROUTES, and LISTENER
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({extended: true}));
PORT        = 9865;                  // Port number
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file

// Access to Static Files
app.use(express.static('public'));

/*
    ROUTES
*/

// Home Page
app.get('/', function (req, res) {
    res.render('index');
});

// Animals Page
app.get('/animals', function(req, res)
{
    let query1;

    // If there is no query string, perform a basic SELECT
    if (req.query.name === undefined){
        query1 = `SELECT Animals.animal_id, Animals.name, Species.species_id, Animals.is_sick FROM Animals 
        JOIN Species ON Animals.species_id = Species.species_id
        GROUP BY Animals.animal_id ASC;`;
    }
    // If there is a query string, assume this is a search and return desired results
    else
    {
        query1 = `SELECT * FROM Animals WHERE lower(Animals.name) LIKE "%${req.query.name}%"`
    }
    
    let query2 = "SELECT * FROM Species;";

    // Using an array to overwrite species_id with species_name
    db.pool.query(query1, function(error, rows, fields){
        let animals = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let species = rows;

            let speciesmap = {}
                species.map(Species => {
                    let id = parseInt(Species.species_id, 10);

                    speciesmap[id] = Species["species_name"];
                })

                animals = animals.map(Animal => {
                    return Object.assign(Animal, {species_id: speciesmap[Animal.species_id]})
                })


            return res.render('animals', {data: animals, species: species});
        })
    })
});

// Add Animals
app.post('/add-animal-ajax', function(req, res) {
    let data = req.body;

    query1 = `INSERT INTO Animals(name, species_id, is_sick)
    VALUES ('${data.name}', '${data.species_id}', '${data.is_sick}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);

        // If there's no error, perform basic SELECT to show table
        } else {
            query2 = `SELECT Animals.animal_id, Animals.name, Species.species_name, Animals.is_sick FROM Animals 
            JOIN Species ON Animals.species_id = Species.species_id
            GROUP BY Animals.animal_id ASC;`;
            
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Animals
app.delete('/delete-animal-ajax/', function(req,res,next){
    let data = req.body;

    let animal_id = parseInt(data.id);
    let deleteAnimals = `DELETE FROM Animals WHERE Animals.animal_id = '${animal_id}';`;
  
          // Run the 1st query
          db.pool.query(deleteAnimals, [animal_id], function(error, rows, fields){
              if (error) {
  
              console.log(error);
              res.sendStatus(400);
              } else {
                res.sendStatus(204);
              }
  })
});

// Update Animals Sick Status
app.put('/put-animal-ajax', function(req,res,next){
    let data = req.body;
    
    let animal_id = parseInt(data.animal_id);
    let sickStatus = parseInt(data.is_sick);
    
    let queryUpdateSick = `UPDATE Animals SET Animals.is_sick = '${sickStatus}' WHERE Animals.animal_id = '${animal_id}';`;
    let selectAnimal = `SELECT * FROM Animals WHERE Animals.animal_id = '${animal_id}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateSick, [animal_id, sickStatus], function(error, rows, fields){
                if (error) {
                console.log(error);
                res.sendStatus(400);

                // If there's no error, run second query to return new data
                } else {
                    db.pool.query(selectAnimal, [animal_id], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })
});

// Species Table
app.get('/species', function(req, res)
{
    let query1 = `SELECT Species.species_id, Species.species_name, Diets.diet_type 
    FROM Species LEFT JOIN Diets ON Species.diet_id = Diets.diet_id
    GROUP BY Species.species_id ASC;`;

    let query2 = `SELECT * FROM Diets;`;

    // Using an array to overwrite diet_id with diet_type
    db.pool.query(query1, function(error, rows, fields){
    
        let species = rows;
        
        db.pool.query(query2, (error, rows, fields) => {
            
            let diets = rows;
            return res.render('species', {data: species, diets: diets});
        })
    })
});

// Add Species
app.post('/add-species-ajax', function(req, res) {
    let data = req.body;

    query1 = `INSERT INTO Species(species_name, diet_id)
    VALUES ('${data.species_name}', '${data.diet_id}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);

        // If there's no error, perform basic SELECT to show table
        } else {
            query2 = `SELECT Species.species_id, Species.species_name, Diets.diet_type 
            FROM Species JOIN Diets ON Species.diet_id = Diets.diet_id
            GROUP BY Species.species_id ASC;`;
            
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Diets Table
app.get('/diets', function(req, res)
{
    let query1 = "SELECT Diets.diet_id, Diets.diet_type FROM Diets;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('diets', {data: rows});
    })
});

// Add diets
app.post('/add-diets-ajax', function(req, res) 
{
    let data = req.body;

    query1 = `INSERT INTO Diets(diet_type) VALUES ('${data.diet_type}');`;

    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            query2 = `SELECT * FROM Diets;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete diets
app.delete('/delete-diets-ajax/', function(req,res,next){
    let data = req.body;

    let diet_id = parseInt(data.id);
    let deleteDiets = `DELETE FROM Diets WHERE Diets.diet_id = '${diet_id}';`;

          db.pool.query(deleteDiets, [diet_id], function(error, rows, fields){
              if (error) {
  
              console.log(error);
              res.sendStatus(400);
              } else {
                res.sendStatus(204);
              }
  })
});

// Feedings Table
app.get('/feedings', function(req, res)
{
    let query1;

    // If there is no query string, perform a basic SELECT
    if (req.query.species === undefined){
        query1 = `SELECT Feedings.feeding_id, Feedings.species_id, Species.species_name, Feedings.zookeeper_id, 
        DATE_FORMAT(Feedings.feeding_date, "%Y-%m-%d") AS "feeding_date", Feedings.feeding_time, Feedings.feeding_description 
        FROM Feedings INNER JOIN Species ON Feedings.species_id = Species.species_id;`;
    }
     // If there is a query string, assume this is a search and return desired results
    else
    {
        query1 = `SELECT Feedings.feeding_id, Feedings.species_id, Species.species_name, Feedings.zookeeper_id, 
        DATE_FORMAT(Feedings.feeding_date, "%Y-%m-%d") AS "feeding_date", Feedings.feeding_time, Feedings.feeding_description 
        FROM Feedings INNER JOIN Species ON Feedings.species_id = Species.species_id
        WHERE lower(Species.species_name) LIKE "%${req.query.species}%"`
    }

    let query2 = "SELECT * FROM Zookeepers;";
    let query3 = "SELECT * FROM Species;";
    
    // Using an array to pass species_name and zookeepers table to fill dropdown
    db.pool.query(query1, function(error, rows, fields){
        let feedings = rows;

        db.pool.query(query2, function(error, rows, fields){
            let zookeepers = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let species = rows;

                return res.render('feedings', {data: feedings, zookeepers: zookeepers, species: species});
            })
        })
    })
});

// Add Feedings
app.post('/add-feeding-ajax', function(req, res) {
    let data = req.body;

    // Capture NULL values for Zookeeper
    let zookeeper_id = parseInt(data.zookeeper_id);
    if (isNaN(zookeeper_id)) {
        zookeeper_id = 'NULL'
    }

    query1 = `INSERT INTO Feedings(species_id, zookeeper_id, feeding_date, feeding_time, feeding_description)
    VALUES ('${data.species_id}', '${data.zookeeper_id}', '${data.feeding_date}', '${data.feeding_time}', '${data.feeding_description}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);

        // If there's no error, perform basic SELECT to show table
        } else {
            let query2 = `SELECT Feedings.feeding_id, Feedings.species_id, Species.species_name, Feedings.zookeeper_id, 
                    DATE_FORMAT(Feedings.feeding_date, "%Y-%m-%d") AS "feeding_date", Feedings.feeding_time, Feedings.feeding_description 
                    FROM Feedings INNER JOIN Species ON Feedings.species_id = Species.species_id;`;

            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Feedings
app.delete('/delete-feeding-ajax/', function(req,res,next){
    let data = req.body;

    let feeding_id = parseInt(data.id);
    let deleteFeeding = `DELETE FROM Feedings WHERE Feedings.feeding_id = '${feeding_id}';`;

          db.pool.query(deleteFeeding, [feeding_id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);

              } else {
                res.sendStatus(204);
              }
  })
});

// Update Feedings
app.put('/put-feeding-ajax', function(req,res,next){
    let data = req.body;

    let feeding_id = parseInt(data.feeding_id);
    let species_id = data.species_id;
    let zookeeper_id = data.zookeeper_id;
    let feeding_date = data.feeding_date;
    let feeding_time = data.feeding_time;
    let feeding_description = data.feeding_description;

    let queryUpdateFeeding = `UPDATE Feedings 
    SET Feedings.species_id = '${species_id}', Feedings.zookeeper_id = '${zookeeper_id}', Feedings.feeding_date = '${feeding_date}',
    Feedings.feeding_time = '${feeding_time}', Feedings.feeding_description = '${feeding_description}'
    WHERE Feedings.feeding_id = '${feeding_id}';`;

    let selectFeeding = `SELECT * FROM Feedings WHERE Feedings.feeding_id = '${feeding_id}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateFeeding, [feeding_id, species_id, zookeeper_id, feeding_date, feeding_time, feeding_description], function(error, rows, fields){
                if (error) {
                console.log(error);
                res.sendStatus(400);

                // If there's no error, run second query to return new data
                } else {
                    db.pool.query(selectFeeding, [feeding_id], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })
});

// Feedings_Kitchens Table
app.get('/feedings_kitchens', function(req, res)
{
    let query1 = `SELECT Feedings_Kitchens.feeding_kitchen_id, Feedings_Kitchens.feeding_id, 
    Feedings_Kitchens.kitchen_id, Kitchens.name
    FROM Feedings_Kitchens
    INNER JOIN Kitchens ON Feedings_Kitchens.kitchen_id = Kitchens.kitchen_id;`;

    let query2 = `SELECT Feedings.feeding_id FROM Feedings ORDER BY Feedings.feeding_id ASC;`;

    let query3 = `SELECT * FROM Kitchens;`;

    // Using an array to pass feeding_id and kitchens table to fill dropdown
    db.pool.query(query1, function(error, rows, fields){

        let feedings_kitchens = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let feedings = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let kitchens = rows;

                return res.render('feedings_kitchens', {data: feedings_kitchens, feedings: feedings, kitchens: kitchens});
            })
        })
    })
});

// Add Feedings_Kitchens
app.post('/add-intersection-ajax', function(req, res) {
    let data = req.body;

    query1 = `INSERT INTO Feedings_Kitchens (feeding_id, kitchen_id)
    VALUES ('${data.feeding_id}', '${data.kitchen_id}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            query2 = `SELECT Feedings_Kitchens.feeding_kitchen_id, Feedings_Kitchens.feeding_id, 
            Feedings_Kitchens.kitchen_id, Kitchens.name
            FROM Feedings_Kitchens
            INNER JOIN Kitchens ON Feedings_Kitchens.kitchen_id = Kitchens.kitchen_id;`;
            
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Feedings_Kitchens
app.delete('/delete-feeding-kitchen-ajax/', function(req,res,next){
    let data = req.body;

    let feeding_kitchen_id = parseInt(data.id);
    let deleteFeedingKitchen = `DELETE FROM Feedings_Kitchens WHERE Feedings_Kitchens.feeding_kitchen_id = '${feeding_kitchen_id}';`;

          db.pool.query(deleteFeedingKitchen, [feeding_kitchen_id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);

              } else {
                res.sendStatus(204);
              }
  })
});

// Update Feeding_Kitchen
app.put('/put-intersection-ajax', function(req,res,next){
    let data = req.body;
    
    let feeding_kitchen_id = parseInt(data.feeding_kitchen_id);
    let feeding_id = parseInt(data.feeding_id);
    let kitchen_id = parseInt(data.kitchen_id);
    
    let queryUpdateIntersection = `UPDATE Feedings_Kitchens SET Feedings_Kitchens.feeding_id = '${feeding_id}', Feedings_Kitchens.kitchen_id = '${kitchen_id}'
    WHERE Feedings_Kitchens.feeding_kitchen_id = '${feeding_kitchen_id}';`;

    let selectIntersection = `SELECT * FROM Feedings_Kitchens WHERE Feedings_Kitchens.feeding_kitchen_id = '${feeding_kitchen_id}';`

            // Run the 1st query
            db.pool.query(queryUpdateIntersection, [feeding_kitchen_id, feeding_id, kitchen_id], function(error, rows, fields){
                if (error) {
                console.log(error);
                res.sendStatus(400);

                // If there's no error, run second query to return new data
                } else {
                    db.pool.query(selectIntersection, [feeding_kitchen_id], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })
});

// Kitchens Table
app.get('/kitchens', function(req, res)
{
    let query1 = "SELECT * FROM Kitchens;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('kitchens', {data: rows});
    })
});

// Add Kitchen
app.post('/add-kitchen-ajax', function(req, res) {
    let data = req.body;

    query1 = `INSERT INTO Kitchens (name)
    VALUES ('${data.name}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            query2 = `SELECT * FROM Kitchens;`;
            
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Kitchen
app.delete('/delete-kitchen-ajax', function(req,res,next){
    let data = req.body;

    let kitchen_id = parseInt(data.id);
    let deleteKitchen = `DELETE FROM Kitchens WHERE kitchen_id = '${kitchen_id}';`;

          db.pool.query(deleteKitchen, [kitchen_id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);

              } else {
                res.sendStatus(204);
              }
  })
});

// Zookeepers Table
app.get('/zookeepers', function(req, res)
{
    let query1 = "SELECT * FROM Zookeepers GROUP BY Zookeepers.zookeeper_id ASC;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('zookeepers', {data: rows});
    })
});

// Add Zookeeper
app.post('/add-zookeeper-ajax', function(req, res) {
    let data = req.body;

    query1 = `INSERT INTO Zookeepers (first_name, last_name)
    VALUES ('${data.first_name}', '${data.last_name}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);

        } else {
            query2 = `SELECT * FROM Zookeepers
            GROUP BY Zookeepers.zookeeper_id ASC;`;
            
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Zookeeper
app.delete('/delete-zookeeper-ajax', function(req,res,next){
    let data = req.body;

    let zookeeper_id = parseInt(data.id);
    let deleteZookeepers = `DELETE FROM Zookeepers WHERE Zookeepers.zookeeper_id = '${zookeeper_id}';`;

          db.pool.query(deleteZookeepers, [zookeeper_id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);

              } else {
                res.sendStatus(204);
              }
  })
});


/*
    LISTENER
*/
// This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});