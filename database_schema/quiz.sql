-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: quiz
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `answers` (
  `ID` int(11) NOT NULL,
  `answer` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`,`answer`),
  UNIQUE KEY `answer_UNIQUE` (`answer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (66,' BANK LEUMI'),(65,' Bank of America'),(72,' Danemarca şi Suedia'),(64,' Deutsche Bank AG'),(62,' Gustav Stresemann'),(70,' Leningrad'),(19,'1847'),(20,'1902'),(21,'1912'),(18,'1954'),(78,'1961'),(79,'1962'),(80,'1963'),(81,'1964'),(16,'Albert Eistein'),(29,'Ankara'),(28,'Antalya'),(60,'Aristide Briand'),(47,'atacului japonezilor la Pearl Harbor'),(3,'Beijing'),(69,'Belgorod'),(49,'bombardamentelor atomice de la Hiroshima și Nagasaki'),(40,'Capitala Majorcai'),(13,'Curcanul'),(1,'Da'),(71,'Danemarca şi Norvegia'),(6,'Dunarea'),(35,'Elbrus'),(12,'Emu'),(36,'Etna'),(24,'Georg Hegel'),(25,'Hamlet'),(22,'Immanuel Kant'),(76,'India'),(39,'Insula in Canare'),(50,'invadării Manciuriei de către japonezi'),(48,'invadării Poloniei de către Germania Nazistă'),(30,'Istanbul'),(82,'Johann Strauss(fiul)'),(83,'Johann Strauss(tatal)'),(84,'Joseph Haydn'),(67,'Kingisepp'),(57,'Ludovic al III-lea'),(56,'Ludovic al lV-lea'),(58,'Ludovic al V-lea'),(55,'Ludovic al XlV-lea'),(75,'Marea Britanie'),(38,'Matterhorn'),(59,'Maurice Rouvier'),(37,'Mont Blanc'),(33,'Montreal'),(5,'New York'),(15,'Nikola Tesla'),(2,'Nu'),(44,'Nurnberg'),(42,'Oras din Italia'),(26,'Othello'),(32,'Ottawa'),(46,'Paris'),(17,'Petrache Poenaru'),(41,'Provincie spaniola'),(63,'Raiffeisen Bank'),(10,'Rata'),(8,'Rin'),(27,'Romeo'),(9,'Ron'),(51,'Salzburg'),(68,'Samara'),(52,'Sarajevo'),(23,'Sigmund Freud'),(54,'Skopje'),(11,'Strutul'),(73,'Suedia şi Norvegia'),(74,'Suedia, Danemarca şi Norvegia'),(53,'Szeged'),(77,'Tanzania'),(61,'Théophile Delcassé'),(14,'Thomas Edison'),(4,'Tokyo'),(31,'Toronto'),(43,'Trianon'),(34,'Vancouver'),(45,'Versailles'),(7,'Volga');
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `correct_ans`
--

DROP TABLE IF EXISTS `correct_ans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `correct_ans` (
  `ID` int(11) NOT NULL,
  `quest_id` int(11) NOT NULL,
  `ans_id` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `quest_id` (`quest_id`),
  KEY `ans_id` (`ans_id`),
  CONSTRAINT `correct_ans_ibfk_1` FOREIGN KEY (`quest_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `correct_ans_ibfk_2` FOREIGN KEY (`ans_id`) REFERENCES `answers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `correct_ans`
--

LOCK TABLES `correct_ans` WRITE;
/*!40000 ALTER TABLE `correct_ans` DISABLE KEYS */;
INSERT INTO `correct_ans` VALUES (1,1,4),(2,2,7),(3,3,11),(4,4,14),(5,5,21),(6,6,23),(7,7,25),(8,8,1),(9,9,29),(10,10,32),(11,11,35),(12,12,39),(13,13,39),(14,14,46),(15,15,48),(16,16,52),(17,17,55),(18,18,60),(19,19,64),(20,20,70),(21,21,71),(22,22,77),(23,23,79),(24,24,82);
/*!40000 ALTER TABLE `correct_ans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `questions` (
  `ID` int(11) NOT NULL,
  `question` varchar(250) DEFAULT NULL,
  `subjectID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_subjectID` (`subjectID`),
  CONSTRAINT `fk_subjectID` FOREIGN KEY (`subjectID`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'Care este cel mai populat oras din lume?',8),(2,'Care este cel mai lung fluviu din Europa?',8),(3,'Care este cea mai mare pasare care traieste pe pament?',9),(4,'Cine a inventat becul?',2),(5,'In ce an s-a scufundat Titanicul?',7),(6,'Cine a fost parintele psihanalizei?',2),(7,'Cui ii apartine expresia \"To be or not to be\" ?',2),(8,'Este adeavart ca Thales provenea din orasul Milet?',2),(9,'Care este capitala Turciei?',8),(10,'Care este capitala Canadei?',8),(11,'Care este cel mai inalt munte din Europa?',8),(12,'Ce este Palma?',8),(13,'Ce este Palma?',8),(14,'Pe 10 februarie 1947, Aliații și Puterile Axei au semnat Tratatele de Pace de la:',7),(15,'Al Doilea Război Mondial s-a declanșat în 1939 ca urmare a:',7),(16,'Primul Război Mondial a izbucnit în 1914 drept consecință a atentatului de la:',7),(17,'Cine a fost monarhul care a avut cea mai lungă domnie din istorie?',7),(18,'Cine a impus în anul 1905, în Franţa, separarea dintre Stat şi Biserică?',7),(19,' Ce bancă a fost înfiinţată în anul 1870 la Berlin?',7),(20,'Ce nume a primit în anul 1924 fostul Sankt Petersburg?',7),(21,' Ce ţări scandinave a anexat Hitler în anul 1940?',7),(22,'Unde s-a născut Freddie Mercury, liderul formaţiei Queen ?',4),(23,'În ce an şi-a lansat formaţia The Beatles discul de debut?  ',4),(24,'Cine a compus valsul „Dunărea albastră“?  ',4);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_table`
--

DROP TABLE IF EXISTS `quiz_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `quiz_table` (
  `ID` int(11) NOT NULL,
  `quest_id` int(11) NOT NULL,
  `ans_id` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `quest_id` (`quest_id`),
  KEY `ans_id` (`ans_id`),
  CONSTRAINT `quiz_table_ibfk_1` FOREIGN KEY (`quest_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `quiz_table_ibfk_2` FOREIGN KEY (`ans_id`) REFERENCES `answers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_table`
--

LOCK TABLES `quiz_table` WRITE;
/*!40000 ALTER TABLE `quiz_table` DISABLE KEYS */;
INSERT INTO `quiz_table` VALUES (1,1,3),(2,1,4),(3,1,5),(4,2,6),(5,2,7),(6,2,8),(7,2,9),(8,3,10),(9,3,11),(10,3,12),(11,3,13),(12,4,14),(13,4,15),(14,4,16),(15,4,17),(16,5,18),(17,5,19),(18,5,20),(19,5,21),(20,6,22),(21,6,23),(22,6,24),(23,7,25),(24,7,26),(25,7,27),(26,8,1),(27,8,2),(28,9,28),(29,9,29),(30,9,30),(31,10,31),(32,10,32),(33,10,33),(34,10,34),(35,11,35),(36,11,36),(37,11,37),(38,11,38),(39,12,39),(40,12,40),(41,12,41),(42,12,42),(43,14,43),(44,14,44),(45,14,45),(46,14,46),(47,15,47),(48,15,48),(49,15,49),(50,15,50),(51,16,51),(52,16,52),(53,16,53),(54,16,54),(55,17,55),(56,17,56),(57,17,57),(58,17,58),(59,18,59),(60,18,60),(61,18,61),(62,18,62),(63,19,63),(64,19,64),(65,19,65),(66,19,66),(67,20,67),(68,20,68),(69,20,69),(70,20,70),(71,21,71),(72,21,72),(73,21,73),(74,21,74),(75,22,75),(76,22,76),(77,22,77),(78,23,78),(79,23,79),(80,23,80),(81,23,81),(82,24,82),(83,24,83),(84,24,84);
/*!40000 ALTER TABLE `quiz_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('GXsTUkOz5QFG3qg6wZx_UHRLl58siOzb',1543519612,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":0}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `subjects` (
  `ID` int(11) NOT NULL,
  `subject` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'Diverse'),(2,'Cultura_generala'),(3,'Sport'),(4,'Muzica'),(5,'Stiinte'),(6,'Literatura'),(7,'Istorie'),(8,'Geografie'),(9,'Biologie'),(10,'Tehnologie');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `total_score` float DEFAULT NULL,
  `admin` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'Dan','ana',6.5,0),(1,'Nicu','aaa',1.6087,0),(2,'','',0,0),(3,'Ana','mere',0,0),(4,'Mihai','kkt',0,0),(5,'admin','quiz',0,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_score`
--

DROP TABLE IF EXISTS `users_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users_score` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `score` float NOT NULL,
  `month` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_score`
--

LOCK TABLES `users_score` WRITE;
/*!40000 ALTER TABLE `users_score` DISABLE KEYS */;
INSERT INTO `users_score` VALUES (0,2,0.25,NULL),(0,8,0.5,NULL),(0,0,0.25,NULL),(1,8,1,NULL),(1,2,1,NULL),(1,9,1,NULL),(1,7,1,NULL),(1,0,1,NULL),(1,7,1,NULL),(1,8,0.5,NULL),(0,0,0.25,NULL),(0,2,0.25,NULL),(5,7,1,NULL),(5,9,1,NULL),(5,2,0.75,NULL),(5,8,1,NULL),(0,0,1,NULL),(4,2,1,NULL),(4,8,1,NULL),(4,8,1,NULL),(0,8,0.5,NULL),(0,7,1,NULL),(0,8,1,NULL),(0,7,1,NULL),(0,9,1,NULL),(0,7,0,NULL),(0,8,1,NULL),(0,2,0.75,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,7,1,NULL),(0,7,1,NULL),(0,2,1,NULL),(0,8,1,NULL),(0,8,1,NULL),(0,2,0.75,NULL),(0,2,0.75,NULL),(0,8,1,NULL),(0,2,1,NULL),(0,2,0.5,NULL),(0,2,0.5,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,8,1,NULL),(0,8,1,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,0,1,NULL),(0,0,1,NULL),(0,2,0.75,NULL),(0,2,0.75,NULL),(0,2,1,NULL),(0,2,1,NULL),(0,2,0.75,NULL),(0,2,0.75,NULL),(0,2,1,NULL),(0,8,1,NULL),(0,7,1,NULL),(0,9,1,NULL),(0,2,1,NULL),(0,9,1,NULL),(0,2,1,NULL),(0,7,1,NULL),(0,8,1,NULL),(0,2,1,NULL),(0,0,1,NULL),(0,2,1,NULL),(0,2,0.5,NULL),(0,2,1,NULL),(0,0,1,NULL),(0,8,1,NULL),(0,2,1,NULL),(0,2,1,11),(0,8,1,11),(0,0,1,11),(6,1,0,11),(6,1,1,11),(6,2,0.666667,11),(6,2,0.5,11),(6,2,0.5,11),(6,2,1,11),(6,2,1,11),(6,2,1,11),(6,2,1,11),(6,2,1,11),(6,4,1,11),(6,7,1,11),(6,8,1,11),(6,4,1,11),(6,9,1,11),(6,0,0.0144928,11),(6,0,0.0144928,11),(6,0,0.565217,11),(1,0,0.608696,11),(1,4,1,11),(1,7,0.888889,11),(1,2,1,11),(1,4,0.666667,11),(0,2,0.75,11),(0,7,0.777778,11),(0,4,0.666667,11),(0,2,1,11);
/*!40000 ALTER TABLE `users_score` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-28 21:29:01
