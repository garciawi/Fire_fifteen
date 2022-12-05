// Citation for the following functions: update intersection form Event Listener and updateRow
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateIntersectionForm = document.getElementById('updateIntersection');

// Modify the objects we need
updateIntersectionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFeedingKitchenId = document.getElementById("input-update-feeding-kitchens-id");
    let inputUpdateFeeding = document.getElementById("input-update-feeding");
    let inputUpdateKitchen = document.getElementById("input-update-kitchen");

    // Get the values from the form fields
    let feeding_kitchen_id = inputFeedingKitchenId.value;
    let feeding_id = inputUpdateFeeding.value;
    let kitchen_id = inputUpdateKitchen.value;

    // Put our data we want to send in a javascript object
    let data = {
        feeding_kitchen_id: feeding_kitchen_id,
        feeding_id: feeding_id,
        kitchen_id: kitchen_id
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // Using PUT method
    xhttp.open("PUT", "/put-intersection-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update table with new values
            updateRow(xhttp.response, feeding_kitchen_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, feeding_kitchen_id){
    let parsedData = JSON.parse(data);

    // Get a reference to the current table on the page and clear it out.
    let table = document.getElementById("feedings-kitchens-table");

    // Iterate through rows
    // rows would be accessed using the "row" variable assigned in the for loop
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == feeding_kitchen_id) {

            // Get the location of the row where we found the matching feeding_kitchen_id
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let feedingTd = updateRowIndex.getElementsByTagName("td")[2];
            let kitchenTd = updateRowIndex.getElementsByTagName("td")[3];
            
            // Reassign each attribute to the value we updated to
            feedingTd.innerHTML = parsedData[0].feeding_id;
            kitchenTd.innerHTML = parsedData[0].kitchen_id; 
       }
    }
    
    // Reload window
    window.location.reload();
}