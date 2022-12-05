// Citation for the following functions: add zookeeper form Event Listener and addRowToTable
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addZookeeperForm = document.getElementById('add-zookeeper-form-ajax');

// Modify the objects we need
addZookeeperForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-first-name");
    let inputLastName = document.getElementById("input-last-name");

    // Get the values from the form fields
    let firstnameValue = inputFirstName.value;
    let lastnameValue = inputLastName.value;

    // Put our data we want to send in a javascript object
    let data = {
        first_name: firstnameValue,
        last_name: lastnameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // Using POST method
    xhttp.open("POST", "/add-zookeeper-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
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
    let currentTable = document.getElementById("zookeepers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let zookeeperIdCell = document.createElement("TD");
    let firstnameCell = document.createElement("TD");
    let lastnameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    
    // Fill the cells with correct data
    zookeeperIdCell.innerText = newRow.zookeeper_id;
    firstnameCell.innerText = newRow.first_name;
    lastnameCell.innerText = newRow.last_name;

    // Create delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteZookeeper(newRow.zookeeper_id);
    };

    // Add the cells to the row 
    row.appendChild(zookeeperIdCell);
    row.appendChild(firstnameCell);
    row.appendChild(lastnameCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.zookeeper_id)

    // Add the row to the table
    currentTable.appendChild(row);

    // Reload window
    window.location.reload();
}