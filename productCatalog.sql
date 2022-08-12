-- MySQL dump 10.13  Distrib 8.0.28, for macos11.6 (x86_64)
--
-- Host: localhost    Database: rainbow-catalog
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `productCatalog`
--

DROP TABLE IF EXISTS `productCatalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productCatalog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `productName` varchar(48) DEFAULT NULL,
  `packSize` varchar(32) DEFAULT NULL,
  `productDescription` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(1024) DEFAULT NULL,
  `grading` varchar(255) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `perishability` varchar(32) DEFAULT NULL,
  `logisticsNeed` varchar(32) DEFAULT NULL,
  `coldChain` varchar(32) DEFAULT NULL,
  `idealDelTat` varchar(32) DEFAULT NULL,
  `skuId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `variant` (`variant`,`productDescription`,`productName`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productCatalog`
--

LOCK TABLES `productCatalog` WRITE;
/*!40000 ALTER TABLE `productCatalog` DISABLE KEYS */;
INSERT INTO `productCatalog` VALUES (73,'tomato','25 kg','tomato-small-green-25 kg pack','https://naturesdelight.in/wp-content/uploads/2018/04/ORGANIC-GREEN-TOMATO.jpg','Small','RohiniGreen','10','crate','Yes','1','1'),(74,'tomato','25 kg','tomato-medium-green-25 kg pack','https://5.imimg.com/data5/DN/RL/MY-42502830/green-tomato-500x500.jpg','Medium','RohiniGreen','10','crate','Yes','1','2'),(75,'tomato','25 kg','tomato-large-green-25 kg pack','https://www.bigbasket.com/media/uploads/p/l/30000608_11-fresho-tomato-green.jpg','Large','RohiniGreen','10','crate','Yes','1','3'),(76,'tomato','25 kg','tomato-large-pink-25 kg pack','https://image.shutterstock.com/image-photo/pink-tomatoes-on-white-background-260nw-1656903511.jpg','Large','RohiniPink','7','crate','Yes','1','6'),(77,'tomato','25 kg','tomato-small-pink-25 kg pack','https://image.shutterstock.com/image-photo/pink-tomatoes-on-white-background-260nw-1656903511.jpg','Small','RohiniPink','7','crate','Yes','1','4'),(78,'tomato','25 kg','tomato-medium-pink-25 kg pack','https://image.shutterstock.com/image-photo/pink-tomatoes-on-white-background-260nw-1656903511.jpg','Medium','RohiniPink','7','crate','Yes','1','5'),(79,'tomato','25 kg','tomato-small-lightred-25 kg pack','https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/image_1/45728/small_f9b317c6-faa2-4ecd-bb65-ca270fd08750.jpg','Small','RohiniLight Red','5','crate','Yes','1','7'),(80,'tomato','25 kg','tomato-large-lightred-25 kg pack','https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/image_1/45728/small_f9b317c6-faa2-4ecd-bb65-ca270fd08750.jpg','Large','RohiniLight Red','5','crate','Yes','1','9'),(81,'tomato','25 kg','tomato-medium-red-25 kg pack','https://cpimg.tistatic.com/05631754/b/4/Fresh-Red-Tomato-w300.jpg','Medium','RohiniRed','3','crate','Yes','1','11'),(82,'tomato','25 kg','tomato-medium-lightred-25 kg pack','https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/image_1/45728/small_f9b317c6-faa2-4ecd-bb65-ca270fd08750.jpg','Medium','RohiniLight Red','5','crate','Yes','1','8'),(83,'tomato','25 kg','tomato-large-red-25 kg pack','https://cpimg.tistatic.com/05631754/b/4/Fresh-Red-Tomato-w300.jpg','Large','RohiniRed','3','pallet','Yes','1','12'),(84,'tomato','25 kg','tomato-small-red-25 kg pack','https://cpimg.tistatic.com/05631754/b/4/Fresh-Red-Tomato-w300.jpg','Small','RohiniRed','3','crate','Yes','1','10'),(85,'banana','1 Bunch','banana-robusta-small-Export quality-Green','https://kumaribasket.com/wp-content/uploads/2020/08/green-banana_2.jpg','small','RobustaAll green','7','pallet','No','2','13'),(86,'banana','1 Bunch','banana-robusta-medium-Class 1','https://pohunch.com/wp-content/uploads/2021/09/10000025-2_3-fresho-banana-robusta-1.jpg','Medium','Robustayellow with brown spots','1','pallet','Yes','1','17'),(87,'banana','1 Bunch','banana-robusta-small-Class 2','https://5.imimg.com/data5/EX/QK/MY-37427162/selection_008-500x500.png','small','RobustaMore yellow than green','7','pallet','No','2','19'),(88,'banana','1 Bunch','banana-robusta-large-Class 2','https://aaryansfarmfresh.com/pub/media/catalog/product/cache/2bb7e1abd97a7c41b17efe5032402b50/4/1/41-banana_robusta_jumbo_.jpg','Large','Robustaall yellow','3','pallet','Yes','1','21'),(89,'banana','1 Bunch','banana-robusta-medium-Class 2','https://aaryansfarmfresh.com/pub/media/catalog/product/cache/2bb7e1abd97a7c41b17efe5032402b50/4/1/41-banana_robusta_jumbo_.jpg','Medium','Robustaall yellow','3','pallet','Yes','1','23'),(90,'banana','1 Bunch','banana-robusta-large-Class 1','https://kumaribasket.com/wp-content/uploads/2020/08/green-banana_2.jpg','Large','RobustaAll green','7','pallet','No','2','18'),(91,'banana','1 Bunch','banana-robusta-medium-Export quality','https://5.imimg.com/data5/EX/QK/MY-37427162/selection_008-500x500.png','Medium','RobustaMore yellow than green','7','pallet','No','2','14'),(92,'banana','1 Bunch','banana-robusta-small-Class 2','https://www.bigbasket.com/media/uploads/p/m/10000025-2_3-fresho-banana-robusta.jpg','small','Robustayellow with brown spots','1','pallet','Yes','1','22'),(93,'banana','1 Bunch','banana-robusta-large-Class 2','https://www.bigbasket.com/media/uploads/p/m/10000025-2_3-fresho-banana-robusta.jpg','Large','Robustayellow with brown spots','1','pallet','Yes','1','24'),(94,'banana','1 Bunch','banana-robusta-small-Class 1','https://www.bigbasket.com/media/uploads/p/m/10000025-2_3-fresho-banana-robusta.jpg','small','Robustaall yellow','3','pallet','Yes','1','16'),(95,'banana','1 Bunch','banana-robusta-large-Export quality','https://5.imimg.com/data5/EL/NU/MY-71836142/banana-fruit-500x500.jpg','Large','RobustaYellow with green tip','5','pallet','Yes','2','15'),(96,'banana','1 Bunch','banana-robusta-medium-Class 2','https://5.imimg.com/data5/EL/NU/MY-71836142/banana-fruit-500x500.jpg','Medium','RobustaYellow with green tip','5','pallet','Yes','2','20');
/*!40000 ALTER TABLE `productCatalog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-12 19:43:03
