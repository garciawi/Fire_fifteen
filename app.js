// Citation for the following function: SETUP, ROUTES, and LISTENER
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
PORT        = 9865;                  // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file

// Static Files
app.use(express.static('public'));

/*
    ROUTES
*/

// Home Page
app.get('/', function (req, res) {
    res.render('index');
});

// Animals
app.get('/animals', function(req, res)
{
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.name === undefined){
        query1 = `SELECT Animals.animal_id, Animals.name, Species.species_id, Animals.is_sick FROM Animals 
        JOIN Species ON Animals.species_id = Species.species_id
        GROUP BY Animals.animal_id ASC;`;
    }
    // If there is a query string, we assume this is a search, and return desired results
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
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })
});

//update animal sickness
app.put('/put-animal-ajax', function(req,res,next){
    let data = req.body;
    
    let animal_id = parseInt(data.animal_id);
    let sickStatus = parseInt(data.is_sick);
    
    let queryUpdateSick = `UPDATE Animals SET Animals.is_sick = '${sickStatus}' WHERE Animals.animal_id = '${animal_id}';`;
    let selectAnimal = `SELECT * FROM Animals WHERE Animals.animal_id = '${animal_id}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateSick, [animal_id, sickStatus], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
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

// Species
app.get('/species', function(req, res)
{
    let query1 = `SELECT Species.species_id, Species.species_name, Diets.diet_type 
    FROM Species LEFT JOIN Diets ON Species.diet_id = Diets.diet_id
    GROUP BY Species.species_id ASC;`;
    let query2 = `SELECT * FROM Diets;`;

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let species = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
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

// Diets
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
        }
        else
        {
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

  
  
          // Run the 1st query
          db.pool.query(deleteDiets, [diet_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});


app.get('/feedings', function(req, res)
{
    let query1;
    // If there is no query string, we just perform a basic SELECT
    if (req.query.feeding_date === undefined){
        query1 = `SELECT Feedings.feeding_id, Feedings.species_id, Species.species_name, Feedings.zookeeper_id, 
        DATE_FORMAT(Feedings.feeding_date, "%Y-%m-%d") AS "feeding_date", Feedings.feeding_time, Feedings.feeding_description 
        FROM Feedings INNER JOIN Species ON Feedings.species_id = Species.species_id;`;
    }
    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        console.log("proper else condition line 296 req.query is:",req.query.feeding_date);
        query1 = `SELECT * FROM Feedings WHERE Feedings.feeding_date="${req.query.feeding_date}";`
        console.log("query1 is now:", query1)

    }

    let query2 = "SELECT * FROM Zookeepers;";
    let query3 = "SELECT * FROM Species;";
    

    // Using an array to overwrite species_id with species_name
    db.pool.query(query1, function(error, rows, fields){
        let feedings = rows;
        db.pool.query(query2, function(error, rows, fields){
            let zookeepers = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let species = rows;

                return res.render('feedings', {data: feedings, zookeepers: zookeepers, species: species});
            })
        })
    })//end of db.pool.query(query1,...)
});


//Add a Feeding
app.post('/add-feeding-ajax', function(req, res) {
    let data = req.body;
    //console.log("in app.js data is:", data)
    //Capture NULL values for Zookeeper
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
        } else {
            let query2 = `SELECT Feedings.feeding_id, Feedings.species_id, Species.species_name, Feedings.zookeeper_id, 
                    DATE_FORMAT(Feedings.feeding_date, "%Y-%m-%d") AS "feeding_date", Feedings.feeding_time, Feedings.feeding_description 
                    FROM Feedings INNER JOIN Species ON Feedings.species_id = Species.species_id;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    //console.log("after query2 is called rows is", rows)
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Feeding
app.delete('/delete-feeding-ajax/', function(req,res,next){
    let data = req.body;
    let feeding_id = parseInt(data.id);
    let deleteFeeding = `DELETE FROM Feedings WHERE Feedings.feeding_id = '${feeding_id}';`;
          // Run the 1st query
          db.pool.query(deleteFeeding, [feeding_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});

//update feeding date
app.put('/put-feeding-ajax', function(req,res,next){
    let data = req.body;
    let feeding_id = parseInt(data.feeding_id);
    let feeding_date = data.feeding_date; 

    let queryUpdateDate = `UPDATE Feedings SET Feedings.feeding_date = '${feeding_date}' WHERE Feedings.feeding_id = '${feeding_id}';`;
    let selectFeeding = `SELECT * FROM Feedings WHERE Feedings.feeding_id = '${feeding_id}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateDate, [feeding_id, feeding_date], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
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

//Feedings_Kitchens
app.get('/feedings_kitchens', function(req, res)
{
    let query1 = `SELECT Feedings_Kitchens.feeding_kitchen_id, Feedings_Kitchens.feeding_id, 
    Feedings_Kitchens.kitchen_id, Kitchens.name
    FROM Feedings_Kitchens
    INNER JOIN Kitchens ON Feedings_Kitchens.kitchen_id = Kitchens.kitchen_id;`;

    let query2 = `SELECT Feedings.feeding_id FROM Feedings ORDER BY Feedings.feeding_id ASC;`;

    let query3 = `SELECT * FROM Kitchens;`;

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

// Add Feeding_Kitchen
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

// Kitchens
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

          // Run the 1st query
          db.pool.query(deleteKitchen, [kitchen_id], function(error, rows, fields){
              if (error) {
  
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});

//Zookeepers
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

          // Run the 1st query
          db.pool.query(deleteZookeepers, [zookeeper_id], function(error, rows, fields){
              if (error) {
  
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});