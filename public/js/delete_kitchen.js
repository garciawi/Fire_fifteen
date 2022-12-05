// Citation for the following functions: deleteKitchen and deleteRow
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteKitchen(kitchen_id) {

    // Put our data we want to send in a javascript object
    let data = {
        id: kitchen_id
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // Using DELETE method
    xhttp.open("DELETE", "/delete-kitchen-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Delete row from table
            deleteRow(kitchen_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(kitchen_id){

    // Get a reference to the current table on the page and clear it out.
    let table = document.getElementById("kitchens-table");

    // Iterate through rows
    // rows would be accessed using the "row" variable assigned in the for loop
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == kitchen_id) {
            table.deleteRow(i);
            break;
       }
    }
}