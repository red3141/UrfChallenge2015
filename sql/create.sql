CREATE SCHEMA `urf`;

USE `urf`;

CREATE TABLE `summoner` (
  `id` BIGINT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `profileIconId` INT NOT NULL,
  `revisionDate` BIGINT NOT NULL,
  `summonerLevel` BIGINT NOT NULL,
  PRIMARY KEY (`id`));
