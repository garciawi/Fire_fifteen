// Citation for the following functions: update sickness form Event Listener and updateRow
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateSicknessForm = document.getElementById('updateAnimalSickness');

// Modify the objects we need
updateSicknessForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAnimalId = document.getElementById("mySelect");
    let inputSick = document.getElementById("input-sick-update");

    // Get the values from the form fields
    let animalID = inputAnimalId.value;
    let sicknessValue = inputSick.value;
    
    // Abort if NULL value for is_sick
    if (isNaN(sicknessValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        animal_id: animalID,
        is_sick: sicknessValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // Using PUT method
    xhttp.open("PUT", "/put-animal-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update table with new values
            updateRow(xhttp.response, animalID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, animal_id){
    let parsedData = JSON.parse(data);

    // Get a reference to the current table on the page and clear it out.
    let table = document.getElementById("animals-table");

    // Iterate through rows
    // rows would be accessed using the "row" variable assigned in the for loop
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == animal_id) {

            // Get the location of the row where we found the matching animal_id
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of sickness value
            let td = updateRowIndex.getElementsByTagName("td")[3];
            
            // Reassign sick status to the value we updated to
            td.innerHTML = parsedData[0].is_sick; 
       }
    }
}
