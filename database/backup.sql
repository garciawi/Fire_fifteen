-- MariaDB dump 10.19  Distrib 10.4.25-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs340_garciawi
-- ------------------------------------------------------
-- Server version	10.6.10-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Animals`
--

DROP TABLE IF EXISTS `Animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Animals` (
  `animal_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `species_id` int(11) NOT NULL,
  `is_sick` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`animal_id`),
  KEY `species_id` (`species_id`),
  CONSTRAINT `Animals_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `Species` (`species_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Animals`
--

LOCK TABLES `Animals` WRITE;
/*!40000 ALTER TABLE `Animals` DISABLE KEYS */;
INSERT INTO `Animals` VALUES (4,'Marty',3,0),(5,'Alex',4,0),(6,'Gloria',5,0),(35,'Snail',6,0),(36,'Stripe',3,0),(37,'Barbara',3,0),(38,'Gallop',3,0),(40,'Mr. Smith',1,0),(41,'Mrs. Smith',1,0),(42,'Nathan Drake',1,0),(43,'Austin Powers',1,0),(45,'Natasha Romanov',1,0),(46,'Susan Cooper',1,0),(47,'Majesty',2,0),(48,'Moondancer',2,0),(49,'Rarity',2,0),(50,'Oleander',2,1),(51,'Elizabeth',4,0),(52,'Charles',4,0),(53,'Victoria',4,0),(54,'Mary',4,0),(55,'Philllip',4,0),(56,'Veggies',4,1),(63,'Tony',5,0),(69,'New Animal',4,1);
/*!40000 ALTER TABLE `Animals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Diets`
--

DROP TABLE IF EXISTS `Diets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Diets` (
  `diet_id` int(11) NOT NULL AUTO_INCREMENT,
  `diet_type` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`diet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Diets`
--

LOCK TABLES `Diets` WRITE;
/*!40000 ALTER TABLE `Diets` DISABLE KEYS */;
INSERT INTO `Diets` VALUES (1,'Herbivores'),(2,'Carnivores'),(3,'Omnivores'),(13,'Xylovores');
/*!40000 ALTER TABLE `Diets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feedings`
--

DROP TABLE IF EXISTS `Feedings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Feedings` (
  `feeding_id` int(11) NOT NULL AUTO_INCREMENT,
  `species_id` int(11) NOT NULL,
  `zookeeper_id` int(11) DEFAULT NULL,
  `feeding_date` date NOT NULL,
  `feeding_time` time NOT NULL,
  `feeding_description` text DEFAULT NULL,
  PRIMARY KEY (`feeding_id`),
  KEY `species_id` (`species_id`),
  KEY `zookeeper_id` (`zookeeper_id`),
  CONSTRAINT `Feedings_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `Species` (`species_id`) ON DELETE CASCADE,
  CONSTRAINT `Feedings_ibfk_2` FOREIGN KEY (`zookeeper_id`) REFERENCES `Zookeepers` (`zookeeper_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedings`
--

LOCK TABLES `Feedings` WRITE;
/*!40000 ALTER TABLE `Feedings` DISABLE KEYS */;
INSERT INTO `Feedings` VALUES (1,3,4,'2022-11-06','13:30:10','Grass in water.'),(2,1,3,'2022-10-01','10:15:45','Sardines, anchovies, and blended krills.'),(3,5,1,'2022-10-03','12:05:22','Grass and a few watermelons.'),(4,4,NULL,'2022-10-05','14:35:30','Pork shoulders and rabbit thighs.'),(9,15,1,'2022-11-17','13:40:00','Grasses and water lilies.'),(12,15,4,'2022-11-18','10:00:00','Grasses and water lilies.');
/*!40000 ALTER TABLE `Feedings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feedings_Kitchens`
--

DROP TABLE IF EXISTS `Feedings_Kitchens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Feedings_Kitchens` (
  `feeding_kitchen_id` int(11) NOT NULL AUTO_INCREMENT,
  `feeding_id` int(11) NOT NULL,
  `kitchen_id` int(11) NOT NULL,
  PRIMARY KEY (`feeding_kitchen_id`),
  KEY `feeding_id` (`feeding_id`),
  KEY `kitchen_id` (`kitchen_id`),
  CONSTRAINT `Feedings_Kitchens_ibfk_1` FOREIGN KEY (`feeding_id`) REFERENCES `Feedings` (`feeding_id`) ON DELETE CASCADE,
  CONSTRAINT `Feedings_Kitchens_ibfk_2` FOREIGN KEY (`kitchen_id`) REFERENCES `Kitchens` (`kitchen_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedings_Kitchens`
--

LOCK TABLES `Feedings_Kitchens` WRITE;
/*!40000 ALTER TABLE `Feedings_Kitchens` DISABLE KEYS */;
INSERT INTO `Feedings_Kitchens` VALUES (1,1,2),(2,2,1),(3,3,2),(4,3,3),(5,4,4),(6,1,1);
/*!40000 ALTER TABLE `Feedings_Kitchens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Kitchens`
--

DROP TABLE IF EXISTS `Kitchens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Kitchens` (
  `kitchen_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`kitchen_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Kitchens`
--

LOCK TABLES `Kitchens` WRITE;
/*!40000 ALTER TABLE `Kitchens` DISABLE KEYS */;
INSERT INTO `Kitchens` VALUES (1,'Northside'),(2,'Southside'),(3,'Westside'),(4,'Eastside');
/*!40000 ALTER TABLE `Kitchens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Species`
--

DROP TABLE IF EXISTS `Species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Species` (
  `species_id` int(11) NOT NULL AUTO_INCREMENT,
  `species_name` varchar(150) NOT NULL,
  `diet_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`species_id`),
  KEY `diet_id` (`diet_id`),
  CONSTRAINT `Species_ibfk_1` FOREIGN KEY (`diet_id`) REFERENCES `Diets` (`diet_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Species`
--

LOCK TABLES `Species` WRITE;
/*!40000 ALTER TABLE `Species` DISABLE KEYS */;
INSERT INTO `Species` VALUES (1,'Penguin',2),(2,'Rhinoceros',1),(3,'Zebra',1),(4,'Lion',2),(5,'Hippopotamus',3),(6,'Cheetah',2),(13,'Wolf',2),(14,'Orca',2),(15,'Beaver',1),(16,'Llama',1),(17,'Sheep',1);
/*!40000 ALTER TABLE `Species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Zookeepers`
--

DROP TABLE IF EXISTS `Zookeepers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Zookeepers` (
  `zookeeper_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  PRIMARY KEY (`zookeeper_id`),
  UNIQUE KEY `full_name` (`first_name`,`last_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Zookeepers`
--

LOCK TABLES `Zookeepers` WRITE;
/*!40000 ALTER TABLE `Zookeepers` DISABLE KEYS */;
INSERT INTO `Zookeepers` VALUES (3,'David','Attenborough'),(12,'Dora','The Explorer'),(4,'Jack','Hanna'),(2,'Jane','Goodall'),(1,'Steve','Irwin');
/*!40000 ALTER TABLE `Zookeepers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-21  7:15:57
