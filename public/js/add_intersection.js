// Get the objects we need to modify
let addIntersectionForm = document.getElementById('add-intersection-form-ajax');

// Modify the objects we need
addIntersectionForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFeedingId = document.getElementById("input-feeding");
    let inputKitchenId = document.getElementById("input-kitchen");

    // Get the values from the form fields
    let feedingIdValue = inputFeedingId.value;
    let kitchenIdValue = inputKitchenId.value;

    // Put our data we want to send in a javascript object
    let data = {
        feeding_id: feedingIdValue,
        kitchen_id: kitchenIdValue
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-intersection-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFeedingId.value = '';
            inputKitchenId.value = '';
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
    let currentTable = document.getElementById("feedings-kitchens-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let feeding_kitchen_idCell = document.createElement("TD");
    let feeding_idCell = document.createElement("TD");
    let kitchen_idCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    
    // Fill the cells with correct data
    feeding_kitchen_idCell.innerText = newRow.feeding_kitchen_id;
    feeding_idCell.innerText = newRow.feeding_id;
    kitchen_idCell.innerText = newRow.kitchen_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteZookeeper(newRow.feeding_kitchen_id);
    };

    // Add the cells to the row 
    row.appendChild(feeding_kitchen_idCell);
    row.appendChild(feeding_idCell);
    row.appendChild(kitchen_idCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.feeding_kitchen_id)

    // Add the row to the table
    currentTable.appendChild(row);

    window.location.reload();
}