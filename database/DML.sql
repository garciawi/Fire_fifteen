-- Database Manipulation queries for Fire Zoo website
-- A colon : character being used to denote the variables that will have data from the backend programming language

-- Show all zookeepers in the table
SELECT * FROM Zookeepers GROUP BY Zookeepers.zookeeper_id ASC;

-- Add a new zookeeper
INSERT INTO Zookeepers (first_name, last_name)
VALUES (:first_name_input, :last_name_input);

-- Delete a zookeeper
DELETE FROM Zookeepers WHERE zookeeper_id = :zookeeper_id_from_dropdown;

-- Show all kitchens in the table
SELECT * FROM Kitchens;

-- Add a kitchen
INSERT INTO Kitchens (name)
VALUES (:name_input);

-- Delete a kitchen
DELETE FROM Kitchens WHERE kitchen_id = :kitchen_id_from_dropdown;

-- Show all feedings in the table (with corresponding species name)
SELECT Feedings.feeding_id AS Id, Feedings.species_id AS "Species Id", Species.species_name AS "Species Name", 
Feedings.zookeeper_id AS "Zookeeper Id", DATE_FORMAT(Feedings.feeding_date, "%Y-%m-%d") AS Date, Feedings.feeding_time AS Time, 
Feedings.feeding_description AS Description
FROM Feedings
INNER JOIN Species ON Feedings.species_id = Species.species_id;

-- Search a feeding by species name
SELECT Feedings.feeding_id AS Id, Feedings.species_id AS "Species Id", Species.species_name AS "Species Name", 
Feedings.zookeeper_id AS "Zookeeper Id", Feedings.feeding_date AS Date, Feedings.feeding_time AS Time, 
Feedings.feeding_description AS Description
FROM Feedings
INNER JOIN Species ON Feedings.species_id = Species.species_id WHERE (Species.species_name = :species_name_input);

-- Add a feeding
INSERT INTO Feedings (species_id, zookeeper_id, feeding_date, feeding_time, feeding_description)
VALUES (:species_id_from_dropdown, :zookeeper_id_from_dropdown, :feeding_date_from_input, :feeding_time_from_input, :feeding_description_from_input);

-- Update a feeding
UPDATE Feedings 
SET species_id = :species_id_from_dropdown, zookeeper_id = :zookeeper_id_from_dropdown,
feeding_date = :feeding_date_from_input, feeding_time = :feeding_time_from_input, 
feeding_description = :feeding_description_from_input
WHERE feeding_id = :feeding_id_from_dropdown;

-- Delete a feeding
DELETE FROM Feedings WHERE feeding_id = :feeding_id_from_dropdown;

-- Show all Feedings_Kitchens (with associated kitchen name)
SELECT Feedings_Kitchens.feeding_kitchen_id, Feedings_Kitchens.feeding_id, Feedings_Kitchens.kitchen_id, Kitchens.name
FROM Feedings_Kitchens
INNER JOIN Kitchens ON Feedings_Kitchens.kitchen_id = Kitchens.kitchen_id;

-- Add a Feedings_Kitchens entry
INSERT INTO Feedings_Kitchen (feeding_id, kitchen_id)
VALUES (:feeding_id_from_dropdown, :kitchen_id_from_dropdown)

-- Dis-associate a kitchen from a feeding (M-to-M relationship deletion)
DELETE FROM Feedings_Kitchens WHERE feeding_id = :feeding_id_from_dropdown AND kitchen_id = :kitchen_id_from_dropdown;

-- Update a Feedings_Kitchens entry
UPDATE Feedings_Kitchens SET Feedings_Kitchens.feeding_id = :feeding_id_from_dropdown, Feedings_Kitchens.kitchen_id = kitchen_id_from_dropdown
WHERE Feedings_Kitchens.feeding_kitchen_id = :feeding_kitchen_id_from_dropdown;

-- Display table with animal id, species, name, is_sick status
SELECT Animals.animal_id, Animals.name, Species.species_id, Animals.is_sick FROM Animals 
JOIN Species ON Animals.species_id = Species.species_id
GROUP BY Animals.animal_id ASC;

-- Insert a new animal to the animal table
INSERT INTO Animals(name, species_id, is_sick)
VALUES (:name_input, :species_id_input, :is_sick_input);

-- Update an animal sick status
UPDATE Animals SET Animals.is_sick = :is_sick_input WHERE Animals.animal_id = Animals.animal_id;

-- Delete an animal
DELETE FROM Animals WHERE Animals.animal_id = :animal_id_input;

-- Display Species table
SELECT Species.species_id, Species.species_name, Diets.diet_type 
FROM Species LEFT JOIN Diets ON Species.diet_id = Diets.diet_id
GROUP BY Species.species_id ASC;

-- Add a new species
INSERT INTO SPECIES(species_name, diet_id)
VALUES (:species_name_input, :diet_id_from_dropdown)

-- Display Diets table
SELECT Diets.diet_id, Diets.diet_type FROM Diets;

-- Add a new diet
INSERT INTO Diets(diet_type) 
VALUES (:diet_type_input);

-- Delete diet
DELETE FROM Diets WHERE diet_id = :diet_id_from_dropdown;