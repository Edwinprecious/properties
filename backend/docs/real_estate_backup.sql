-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: real_estate
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favorites`
--



DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_favorite` (`user_id`,`property_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `valerie` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `message` text NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `user_phone` varchar(100) DEFAULT NULL,
  `status` enum('pending','responded','closed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `inquiries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `valerie` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inquiries_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(300) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `location` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category` enum('rent','land','airbnb','sell','buy') NOT NULL DEFAULT 'buy',
  `status` enum('active','sold','rented','occupied') NOT NULL DEFAULT 'active',
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,'Modern Duplex Apartment','modern-duplex-apartment',350000.00,'Lekki','12 Admiralty Way, Lekki Phase 1, Lagos','A modern duplex apartment with 4 bedrooms, a swimming pool, and 24/7 power.',NULL,'2025-10-04 10:21:26','buy','active',NULL,NULL),(2,'Luxury Apartment','luxury-apartment',800000.00,'Ikoyi','5A Banana Island Road, Ikoyi, Lagos','An elegant 3-bedroom apartment with sea view and smart home features.',NULL,'2025-10-04 10:27:07','buy','active',NULL,NULL),(3,'Luxury 3-Bedroom Apartment','luxury-3-bedroom-apartment',250000.00,'Lagos','123 Lekki Phase 1','Beautiful apartment with ocean view','https://example.com/image1.jpg','2025-10-10 12:09:58','rent','active',NULL,NULL),(4,'Luxury 3-Bedroom Apartment','luxury-3-bedroom-apartment-2',250000.00,'Lagos','123 Lekki Phase 1','Beautiful apartment with ocean view','https://example.com/image1.jpg','2025-10-10 12:48:29','rent','active',NULL,NULL);
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_images`
--

DROP TABLE IF EXISTS `property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_images`
--

LOCK TABLES `property_images` WRITE;
/*!40000 ALTER TABLE `property_images` DISABLE KEYS */;
INSERT INTO `property_images` VALUES (1,1,'http://127.0.0.1:5000/static/images/lekki1.jpg','2025-10-04 10:26:25'),(2,1,'http://127.0.0.1:5000/static/images/image_fx.jpg','2025-10-04 10:26:25'),(3,2,'https://example.com/images/Searching.jpg','2025-10-04 10:36:59'),(4,2,'https://example.com/images/berlin.jpg','2025-10-04 10:36:59'),(5,3,'https://example.com/image2.jpg','2025-10-10 12:09:58'),(6,3,'https://example.com/image3.jpg','2025-10-10 12:09:58'),(7,4,'https://example.com/image2.jpg','2025-10-10 12:48:29'),(8,4,'https://example.com/image3.jpg','2025-10-10 12:48:29');
/*!40000 ALTER TABLE `property_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valerie`
--

DROP TABLE IF EXISTS `valerie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valerie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `role` enum('user','agent','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valerie`
--

LOCK TABLES `valerie` WRITE;
/*!40000 ALTER TABLE `valerie` DISABLE KEYS */;
INSERT INTO `valerie` VALUES (1,'edwin ','preciouse7@gmail.com','scrypt:32768:8:1$fntdaWXFV4rqDyBG$cda94f1d15024a39e278d80856dea0eaf50a88d2d56050c317e4ab6c98e53eb1d133c6c1aa88e9b8cb5c5318ed71f6237f31421f603c8dd1dfa1c295acf452ac','0996678',NULL,'2025-09-19 00:25:55'),(2,'hagga','Edwinprecious@gmail.com','scrypt:32768:8:1$5Cu9yvZ2u4hDrmZI$2dd33d2620fcf82566e775769dc47de1043e2912daa356bae5d9f3e5819b6c9e6eaecc2a8363d819241fb4f8d931d327fb47c34e6a9b71066fcb06849550e112','98765556',NULL,'2025-09-20 14:24:59'),(3,'Admin User','admin@test.com','scrypt:32768:8:1$FQX6XubDbmgPlKT2$5c2d2d7d6812a32ad68b43357dfd722519e1a096d47eb38a7978aba22fab9d01514fd0f7c8c2eea4b7bc1535d73db0a45d13519d806a2bfd935f3e3493268d85','1234567890','admin','2025-10-09 15:33:12'),(4,'User','user@test.com','scrypt:32768:8:1$r3ke4QCzkK235VBU$e7814dcb8c1208873de29c7983d5f04cce42d712a967a916dfed502460ba74298ca1eca521014303ee66951250deaebd2e3a61649d4ceee497bc8d20420483f4','1234567890','user','2025-10-12 06:44:11');
/*!40000 ALTER TABLE `valerie` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-13 16:02:05
