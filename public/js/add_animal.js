// Get the objects we need to modify
let addAnimalForm = document.getElementById('add-animal-form-ajax');

// Modify the objects we need
addAnimalForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSpecies = document.getElementById("input-species");
    let inputName = document.getElementById("input-name");
    let inputIsSick = document.getElementById("input-is-sick");

    // Get the values from the form fields
    let speciesValue = inputSpecies.value;
    let nameValue = inputName.value;
    let issickValue = inputIsSick.value;

    // Put our data we want to send in a javascript object
    let data = {
        species: speciesValue,
        name: nameValue,
        issick: issickValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-animal-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSpecies.value = '';
            inputName.value = '';
            inputIsSick.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("animals-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let animalidCell = document.createElement("TD");
    let speciesCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let issickCell = document.createElement("TD");

    // Fill the cells with correct data
    animalidCell.innerText = newRow.id;
    speciesCell.innerText = newRow.species;
    nameCell.innerText = newRow.name;
    issickCell.innerText = newRow.issick;

    // Add the cells to the row 
    row.appendChild(animalidCell);
    row.appendChild(speciesCell);
    row.appendChild(nameCell);
    row.appendChild(issickCell);

    // Add the row to the table
    currentTable.appendChild(row);
};