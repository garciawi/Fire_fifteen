# Fire_fifteen
Project for CS 340 Database course
# Overview
A team of zoologists at Fire Zoo is in need of a database to track the spread of foodborne illnesses among
animals. Fire Zoo is a medium-sized zoo with a maximum capacity of 2,000 Animals and 20 Zookeepers.
The zoo is large enough that it needs 4 Kitchens and needs several Zookeepers to feed all of the Animals.
A database-driven website will record Feedings that occur that the zoo. This will give the zoologists
information about which Animal was fed on what day of the week, the Zookeeper that fed the Animal,
and which Kitchen prepared the feeding. The database will also keep track of the Diet of each Species at
the zoo. Using an electronic database will reduce the amount of time and effort needed during the
investigation stage and result in prompt intervention and treatment when an illness is detected.

# Outline
● Species: records the species of the animals at the zoo.
○ species_id: int, auto_increment, unique, NOT NULL, PK
○ species_name: varchar(150), unique, NOT NULL
○ Relationship: A 1:M relationship between Species and Feedings. A single
Species can be associated with multiple Feedings but each Feeding can only be used to
feed one Species.
● Diets: records the type of diet a species consumes.
○ diet_id : int, auto_increment, unique, NOT NULL, PK
○ diet_type: varchar(150)
○ Relationship: A 1:M relationship between Diets and Species. A Species can be associated
with one Diet but many Species can be associated with the same Diet.
● Animals: records the details of the animals at the zoo.
○ animal_id: int, auto_increment, unique, NOT NULL, PK
○ species_id: int, NOT NULL, FK
○ name: varchar(150), NOT NULL
○ species: varchar(150), NOT NULL
○ is_sick: boolean(0), NOT NULL
○ Relationship: A 1:M relationship between Animals and Species. An Animal
can belong to one Species and a Species can be associated with many Animals.
● Feedings: records the details of each feeding that occurred.
○ feeding_id: int, auto_increment, unique, NOT NULL, PK
○ species_id: int, NOT NULL, FK
○ zookeeper_id: int, NOT NULL, FK
○ feeding_date: date, NOT NULL
○ feeding_time time, NOT NULL
○ feeding_description text, NOT NULL
○ Relationships: A 1:M relationship between Species and Feedings with species_id as
FK inside Feedings. A 1:M relationship between Zookeepers and Feedings with zookeeper_id as a FK
inside Feedings.A M:M relationship between Kitchen and Feedings. Will require an
intersection table with kitchen_id as a FK inside.
● Zookeepers: records the details of employees who are responsible for carrying out the feeding.
○ zookeeper_id: int, auto_increment, unique, NOT NULL, PK
○ first_name: varchar(150), NOT NULL
○ last_name: varchar(150), NOT NULL
○ Relationship: A 1:M relationship between Zookeepers and Feedings. One Zookeeper can
be associated with many Feedings but each Feeding can be associated with one
Zookeeper.
● Kitchens: records the details of the kitchen that prepared the food for feeding.
○ kitchen_id: int, auto_increment, unique, NOT NULL, PK
○ name: varchar(150), NOT NULL
○ Relationship: A M:M relationship between Kitchen and Feedings. One
Kitchen can be associated with many Feedings and one Feeding can be associated with
many Kitchens. Will require an intersection table with feeding_id as a FK inside.

# ERD diagram
![image](https://user-images.githubusercontent.com/55792276/197834463-35d55e6a-25b3-4b61-81da-e1ccd75f1ccb.png)

# Schema

![image](https://user-images.githubusercontent.com/55792276/197834629-dfa2e388-0523-4f5d-b8d8-ba033fb04fc1.png)

