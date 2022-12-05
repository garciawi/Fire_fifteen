// Citation for the following functions: add diets form Event Listener and addRowToTable
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addDietsForm = document.getElementById('add-diets-form-ajax');

// Modify the objects we need
addDietsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDiets = document.getElementById("input-diets");
    
    // Get the values from the form fields
    let dietsNameValue = inputDiets.value;

    // Put our data we want to send in a javascript object
    let data = {
        diet_type: dietsNameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // Using POST method
    xhttp.open("POST", "/add-diets-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("response after line 27 of add_diets.js is:", xhttp.response)

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDiets.value = '';

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
    let currentTable = document.getElementById("diets-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let dietsIdCell = document.createElement("TD");
    let dietTypeCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    
    // Fill the cells with correct data
    dietsIdCell.innerText = newRow.diet_id;
    dietTypeCell.innerText = newRow.diet_type;

    // Create delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSpecies(newRow.diet_id);
    };

    // Add the cells to the row 
    row.appendChild(dietsIdCell);
    row.appendChild(dietTypeCell);
    row.appendChild(deleteCell);


    // Add the row to the table
    currentTable.appendChild(row);

    // Reload window
    window.location.reload();
    
}