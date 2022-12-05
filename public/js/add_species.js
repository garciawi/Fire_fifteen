// Citation for the following functions: add species form Event Listener and addRowToTable
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addSpeciesForm = document.getElementById('add-species-form-ajax');

// Modify the objects we need
addSpeciesForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSpecies = document.getElementById("input-species");
    let inputDiet = document.getElementById("input-diet");

    // Get the values from the form fields
    let speciesNameValue = inputSpecies.value;
    let dietValue = inputDiet.value;

    // Put our data we want to send in a javascript object
    let data = {
        species_name: speciesNameValue,
        diet_id: dietValue
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // Using POST method
    xhttp.open("POST", "/add-species-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSpecies.value = '';
            inputDiet.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("species-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("New row is:", newRow)

    // Create a row and cells
    let row = document.createElement("TR");
    let speciesIdCell = document.createElement("TD");
    let speciesNameCell = document.createElement("TD");
    let dietTypeCell = document.createElement("TD");
    
    // Fill the cells with correct data
    speciesIdCell.innerText = newRow.species_id;
    speciesNameCell.innerText = newRow.species_name;
    dietTypeCell.innerText = newRow.diet_type;

    // Add the cells to the row 
    row.appendChild(speciesIdCell);
    row.appendChild(speciesNameCell);
    row.appendChild(dietTypeCell);


    // Add the row to the table
    currentTable.appendChild(row);

    // Reload window
    window.location.reload();

}