CREATE SCHEMA `urf`;

USE `urf`;

CREATE TABLE `champion` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `title` VARCHAR(100) NULL,
  `lore` VARCHAR(1000) NULL,
  `fullImage` VARCHAR(100) NULL,
  `spriteImage` VARCHAR(100) NULL,
  `imageGroup` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE `match` (
  `id` bigint(20) NOT NULL,
  `mapId` bigint(20) NOT NULL,
  `matchCreation` bigint(20) NOT NULL,
  `matchDuration` bigint(20) NOT NULL,
  `matchMode` int(11) NOT NULL,
  `matchType` int(11) NOT NULL,
  `matchVersion` varchar(45) DEFAULT NULL,
  `queueType` int(11) NOT NULL,
  `region` varchar(5) DEFAULT NULL,
  `season` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `team` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `teamId` int(11) NOT NULL,
  `matchId` bigint(20) NOT NULL,
  `baronKills` int(11) NOT NULL,
  `dragonKills` int(11) NOT NULL,
  `firstBaron` bit(1) NOT NULL,
  `firstBlood` bit(1) NOT NULL,
  `firstDragon` bit(1) NOT NULL,
  `firstInhibitor` bit(1) NOT NULL,
  `firstTower` bit(1) NOT NULL,
  `inhibitorKills` int(11) NOT NULL,
  `towerKills` int(11) NOT NULL,
  `vilemawKills` int(11) NOT NULL,
  `winner` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_team_match_idx` (`matchId`),
  CONSTRAINT `fk_team_match` FOREIGN KEY (`matchId`) REFERENCES `match` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `participant` (
  `id` int(11) NOT NULL,
  `matchId` bigint(20) NOT NULL,
  `championId` int(11) NOT NULL,
  `spell1Id` int(11) NOT NULL,
  `spell2Id` int(11) NOT NULL,
  `teamId` int(11) NOT NULL,
  PRIMARY KEY (`id`,`matchId`),
  KEY `fk_participant_match_idx` (`matchId`),
  CONSTRAINT `fk_participant_match` FOREIGN KEY (`matchId`) REFERENCES `match` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `banned_champion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pickTurn` int(11) NOT NULL,
  `championId` int(11) NOT NULL,
  `teamId` int(11) DEFAULT NULL,
  `matchId` bigint(20) NOT NULL,
  `teamRecordId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bannedChampion_match_idx` (`matchId`),
  KEY `fk_bannedChampion_team_idx` (`teamRecordId`),
  CONSTRAINT `fk_bannedChampion_match` FOREIGN KEY (`matchId`) REFERENCES `match` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_bannedChampion_team` FOREIGN KEY (`teamRecordId`) REFERENCES `team` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `killerId` int(11) DEFAULT NULL,
  `buildingType` int(11) NOT NULL,
  `creatorId` int(11) DEFAULT NULL,
  `eventType` int(11) NOT NULL,
  `itemAfter` int(11) DEFAULT NULL,
  `itemBefore` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `laneType` int(11) NOT NULL,
  `levelUpType` int(11) NOT NULL,
  `monsterType` int(11) NOT NULL,
  `participantId` int(11) DEFAULT NULL,
  `skillSlot` int(11) DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  `gameTime` time NOT NULL,
  `towerType` int(11) NOT NULL,
  `victimId` int(11) DEFAULT NULL,
  `wardType` int(11) NOT NULL,
  `matchId` bigint(20) NOT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_match_idx` (`matchId`),
  KEY `fk_event_participant_idx` (`participantId`,`matchId`),
  CONSTRAINT `fk_event_match` FOREIGN KEY (`matchId`) REFERENCES `match` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `assist` (
  `eventId` bigint(20) NOT NULL,
  `participantId` int(11) NOT NULL,
  `matchId` bigint(20) NOT NULL,
  PRIMARY KEY (`eventId`,`participantId`,`matchId`),
  KEY `fk_assist_match_idx` (`matchId`),
  KEY `fk_assist_participant_idx` (`participantId`,`matchId`),
  CONSTRAINT `fk_assist_event` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_assist_match` FOREIGN KEY (`matchId`) REFERENCES `match` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_assist_participant` FOREIGN KEY (`participantId`, `matchId`) REFERENCES `participant` (`id`, `matchId`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

ALTER TABLE `urf`.`event` 
CHANGE COLUMN `gameTime` `timestamp` TIME NOT NULL ;

