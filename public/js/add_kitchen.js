// Get the objects we need to modify
let addKitchenForm = document.getElementById('add-kitchen-form-ajax');

// Modify the objects we need
addKitchenForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");

    // Get the values from the form fields
    let nameValue = inputName.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-kitchen-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("kitchens-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let kitchenIdCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    
    // Fill the cells with correct data
    kitchenIdCell.innerText = newRow.kitchen_id;
    nameCell.innerText = newRow.name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteKitchen(newRow.kitchen_id);
    };

    // Add the cells to the row 
    row.appendChild(kitchenIdCell);
    row.appendChild(nameCell);

    row.setAttribute('data-value', newRow.kitchen_id)

    // Add the row to the table
    currentTable.appendChild(row);

    window.location.reload();
}