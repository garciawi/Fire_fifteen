// Citation for the following functions: update feeding form Event Listener and updateRow
// Date: 11/08/2022
// Adapted from nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateFeedingForm = document.getElementById('updateFeeding');

// Modify the objects we need
updateFeedingForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFeedingId = document.getElementById("mySelect");
    let inputUpdateSpecies = document.getElementById("input-update-species");
    let inputUpdateZookeeper = document.getElementById("input-update-zookeeper");
    let inputUpdateDate = document.getElementById("input-update-date");
    let inputUpdateTime = document.getElementById("input-update-time");
    let inputUpdateDescription = document.getElementById("input-update-description");

    // Get the values from the form fields
    let feeding_id = inputFeedingId.value;
    let species_id = inputUpdateSpecies.value;
    let zookeeper_id = inputUpdateZookeeper.value;
    let feeding_date = inputUpdateDate.value;
    let feeding_time = inputUpdateTime.value;
    let feeding_description = inputUpdateDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        feeding_id: feeding_id,
        species_id: species_id,
        zookeeper_id: zookeeper_id,
        feeding_date: feeding_date,
        feeding_time: feeding_time,
        feeding_description: feeding_description
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    // Using PUT method
    xhttp.open("PUT", "/put-feeding-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update table with new values
            updateRow(xhttp.response, feeding_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, feeding_id){
    let parsedData = JSON.parse(data);

    // Get a reference to the current table on the page and clear it out.
    let table = document.getElementById("feedings-table");

    // Iterate through rows
    // rows would be accessed using the "row" variable assigned in the for loop
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == feeding_id) {

            // Get the location of the row where we found the matching feeding_id
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let speciesTd = updateRowIndex.getElementsByTagName("td")[2];
            let zookeeperTd = updateRowIndex.getElementsByTagName("td")[3];
            let dateTd = updateRowIndex.getElementsByTagName("td")[4];
            let timeTd = updateRowIndex.getElementsByTagName("td")[5];
            let descriptionTd = updateRowIndex.getElementsByTagName("td")[6];
            
            // Reassign each attribute to the value we updated to
            speciesTd.innerHTML = parsedData[0].species_id;
            zookeeperTd.innerHTML = parsedData[0].zookeeper_id;
            dateTd.innerHTML = parsedData[0].feeding_date;
            timeTd.innerHTML = parsedData[0].feeding_time;
            descriptionTd.innerHTML = parsedData[0].feeding_description;
       }
    }
    
    // Reload window
    window.location.reload();
}
