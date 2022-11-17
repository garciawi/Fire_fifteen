// Get the objects we need to modify
let addFeedingForm = document.getElementById('add-feeding-form-ajax');

// Modify the objects we need
addFeedingForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSpeciesId = document.getElementById("input-species");
    let inputZookeeperId = document.getElementById("input-zookeeper");
    let inputDate = document.getElementById("input-date");
    let inputTime = document.getElementById("input-time");
    let inputDescription = document.getElementById("input-description");

    // Get the values from the form fields
    let speciesId = inputSpeciesId.value;
    let zookeeperId = inputZookeeperId.value;
    let dateInput = inputDate.value;
    let timeInput = inputTime.value;
    let descriptionInput = inputDescription.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        species_id: speciesId,
        zookeeper_id: zookeeperId,
        feeding_date : dateInput,
        feeding_time : timeInput,
        feeding_description : descriptionInput
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-feeding-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSpeciesId.value = '';
            inputZookeeperId.value = '';
            inputDate.value = '';
            inputTime.value = '';
            inputDescription.value = '';
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
    // console.log("in add_feedings.js in addRowToTable data is:", data)
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("feedings-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let feedingIdCell = document.createElement("TD");
    let speciesIdCell = document.createElement("TD");
    let speciesNameCell = document.createElement("TD");
    let zookeeperIdCell = document.createElement("TD");
    let feedingDateCell = document.createElement("TD");
    let feedingTimeCell = document.createElement("TD");
    let feedingDescriptionCell = document.createElement("TD");

    // Fill the cells with correct data
    feedingIdCell.innerText = newRow.feeding_id;
    speciesIdCell.innerText = newRow.species_id;
    speciesNameCell.innerText = newRow.species_name;
    zookeeperIdCell.innerText = newRow.zookeeper_id;
    feedingDateCell.innerText = newRow.feeding_date;
    feedingTimeCell.innerText = newRow.feeding_time;
    feedingDescriptionCell.innerText = newRow.feeding_description;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAnimal(newRow.feeding_id);
    };

    // editCell = document.createElement("button");
    // editCell.innerHTML = "Edit";
    // editCell.onclick = function(){
    //     editAnimal(newRow.animal_id);
    // };

    // Add the cells to the row 
    row.appendChild(feedingIdCell);
    row.appendChild(speciesIdCell);
    row.appendChild(speciesNameCell);
    row.appendChild(zookeeperIdCell);
    row.appendChild(feedingDateCell);
    row.appendChild(feedingTimeCell);
    row.appendChild(feedingDescriptionCell);
    row.appendChild(deleteCell);
    

    row.setAttribute('data-value', newRow.feeding_id)

    // Add the row to the table
    currentTable.appendChild(row);

    
    // Find drop down menu, create a new option, fill data in the option,
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh

    // let selectMenu = document.getElementById("mySelect");
    // let option = document.createElement("option");
    // option.text = newRow.name;
    // option.value = newRow.is_sick;
    // selectMenu.add(option);

}