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
PORT        = 9866;                 // Set a port number at the top so it's easy to change in the future
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

// Species
app.get('/species', function(req, res)
{
    let query1 = "SELECT Species.species_id, Species.species_name, Diets.diet_type FROM Species JOIN Diets ON Species.diet_id = Diets.diet_id;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('species', {data: rows});
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

//Feedings
app.get('/feedings', function(req, res)
{
    let query1 = `
    SELECT Feedings.feeding_id, Feedings.species_id, Species.species_name, Feedings.zookeeper_id, 
    DATE_FORMAT(Feedings.feeding_date, "%Y-%m-%d") AS "feeding_date", Feedings.feeding_time, Feedings.feeding_description 
    FROM Feedings 
    INNER JOIN Species ON Feedings.species_id = Species.species_id;`;

    db.pool.query(query1, function(error, rows, fields){

        res.render('feedings', {data: rows});
    })
});

//Feedings_Kitchens
app.get('/feedings_kitchens', function(req, res)
{
    let query1 = `SELECT Feedings_Kitchens.feeding_kitchen_id, Feedings_Kitchens.feeding_id, 
    Feedings_Kitchens.kitchen_id, Kitchens.name
    FROM Feedings_Kitchens
    INNER JOIN Kitchens ON Feedings_Kitchens.kitchen_id = Kitchens.kitchen_id;`;

    db.pool.query(query1, function(error, rows, fields){

        res.render('feedings_kitchens', {data: rows});
    })
});

//Kitchens
app.get('/kitchens', function(req, res)
{
    let query1 = "SELECT * FROM Kitchens;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('kitchens', {data: rows});
    })
});

//Zookeepers
app.get('/zookeepers', function(req, res)
{
    let query1 = "SELECT * FROM Zookeepers;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('zookeepers', {data: rows});
    })
});

// Add Animals
app.post('/add-animal-ajax/', function(req, res) {
    let data = req.body;

    query1 = `INSERT INTO Animals(name, species_id, is_sick)
    VALUES ('${data.name}', '${data.species_id}', '${data.is_sick}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/animals');
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
  })});

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
    })});
    


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});