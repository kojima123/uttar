CREATE TABLE `shared_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nickname` varchar(50) NOT NULL,
	`area` varchar(20) NOT NULL,
	`side` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shared_records_id` PRIMARY KEY(`id`)
);
