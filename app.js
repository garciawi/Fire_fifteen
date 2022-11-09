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
PORT        = 9865;                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file

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
    let query1 = "SELECT Animals.animal_id, Species.species_name, Animals.name, Animals.is_sick FROM Animals JOIN Species ON Animals.species_id = Species.species_id;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('animals', {data: rows});
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
    SELECT Feedings.feeding_id, Feedings.species_id, Species.species_name, Feedings.zookeeper_id, Feedings.feeding_date, 
    Feedings.feeding_time, Feedings.feeding_description 
    FROM Feedings 
    INNER JOIN Species ON Feedings.species_id = Species.species_id;
    `;

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

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});