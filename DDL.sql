SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS `Diets`;
DROP TABLE IF EXISTS `Species`;
DROP TABLE IF EXISTS `Animals`;
DROP TABLE IF EXISTS `Kitchens`;
DROP TABLE IF EXISTS `Zookeepers`;
DROP TABLE IF EXISTS `Feedings`;
DROP TABLE IF EXISTS `Feedings_Kitchens`;

-- Create Diets Table
CREATE TABLE `Diets` (
    diet_id int NOT NULL AUTO_INCREMENT,
    diet_type varchar(150),
    PRIMARY KEY (diet_id)
);

-- Create Species Table
CREATE TABLE `Species` (
    species_id int NOT NULL AUTO_INCREMENT,
    species_name varchar(150) NOT NULL,
    diet_id int,
    PRIMARY KEY (species_id),
    FOREIGN KEY (diet_id) REFERENCES Diets(diet_id) ON DELETE CASCADE
);

-- Create Animals Table
CREATE TABLE `Animals` (
    animal_id int NOT NULL AUTO_INCREMENT,
    name varchar(150) NOT NULL,
    species_id int NOT NULL,
    is_sick BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (animal_id),
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE
);

-- Create Kitchens Table
CREATE TABLE `Kitchens` (
    kitchen_id int NOT NULL AUTO_INCREMENT,
    name varchar(150) NOT NULL,
    PRIMARY KEY (kitchen_id)
);

-- Create Zookeepers Table
CREATE TABLE `Zookeepers` (
    zookeeper_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    PRIMARY KEY (zookeeper_id),
    CONSTRAINT full_name UNIQUE (first_name, last_name)
);

-- Create Feedings Table
CREATE TABLE `Feedings` (
    feeding_id int NOT NULL AUTO_INCREMENT,
    species_id int NOT NULL,
    zookeeper_id int NOT NULL,
    feeding_date DATE NOT NULL,
    feeding_time TIME NOT NULL,
    feeding_description TEXT,
    PRIMARY KEY (feeding_id),
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE,
    FOREIGN KEY (zookeeper_id) REFERENCES Zookeepers(zookeeper_id) ON DELETE CASCADE
);

-- Create Feedings_Kitchens Table
CREATE TABLE `Feedings_Kitchens` (
    feeding_kitchen_id int NOT NULL AUTO_INCREMENT,
    feeding_id int NOT NULL,
    kitchen_id int NOT NULL,
    PRIMARY KEY (feeding_kitchen_id),
    FOREIGN KEY (feeding_id) REFERENCES Feedings(feeding_id) ON DELETE CASCADE,
    FOREIGN KEY (kitchen_id) REFERENCES Kitchens(kitchen_id) ON DELETE CASCADE
);

-- Insert Data into Diets Table
INSERT INTO Diets (diet_type)
VALUES (
    "Herbivores"
), (
    "Carnivores"
), (
    "Omnivores"
);

-- Insert Data into Species
INSERT INTO Species (species_name, diet_id)
VALUES (
    "Penguin",
    (SELECT diet_id FROM Diets WHERE diet_type = "Carnivores")
), (
    "Rhinoceros",
    (SELECT diet_id FROM Diets WHERE diet_type = "Herbivores")
), (
    "Zebra",
    (SELECT diet_id FROM Diets WHERE diet_type = "Herbivores")
), (
    "Lion",
    (SELECT diet_id FROM Diets WHERE diet_type = "Carnivores")
), (
    "Hippopotamus",
    (SELECT diet_id FROM Diets WHERE diet_type = "Omnivores")
), (
    "Cheetah",
    (SELECT diet_id FROM Diets WHERE diet_type = "Carnivores")
);

-- Insert Data into Animals
INSERT INTO Animals (name, species_id, is_sick)
VALUES (
    "Mumble",
    (SELECT species_id FROM Species WHERE species_name = "Penguin"),
    0
), (
    "Lovelace",
    (SELECT species_id FROM Species WHERE species_name = "Penguin"),
    0
), (
    "Moto",
    (SELECT species_id FROM Species WHERE species_name = "Rhinoceros"),
    0
), (
    "Marty",
    (SELECT species_id FROM Species WHERE species_name = "Zebra"),
    0
), (
    "Alex",
    (SELECT species_id FROM Species WHERE species_name = "Lion"),
    0
), (
    "Gloria",
    (SELECT species_id FROM Species WHERE species_name = "Hippopotamus"),
    0
), (
    "Benjamin",
    (SELECT species_id FROM Species WHERE species_name = "Cheetah"),
    1
);

-- Insert Data into Zookeepers
INSERT INTO Zookeepers (first_name, last_name)
VALUES (
    "Steve",
    "Irwin"
), (
    "Jane",
    "Goodall"
), (
    "David",
    "Attenborough"
), (
    "Jack",
    "Hanna"
);

-- Insert Data into Kitchens
INSERT INTO Kitchens (name)
VALUES (
    "Northside"
), (
    "Southside"
), (
    "Westside"
), (
    "Eastside"
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
