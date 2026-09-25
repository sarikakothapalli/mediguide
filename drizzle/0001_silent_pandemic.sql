CREATE TABLE `health_flags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`flag_name` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `health_flags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `symptom_checks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`symptom` varchar(255) NOT NULL,
	`onset` varchar(50) NOT NULL,
	`duration` varchar(50) NOT NULL,
	`associated_symptoms` text,
	`pain_scale` int,
	`severity` enum('mild','moderate','severe','critical') NOT NULL,
	`specialty` varchar(100),
	`red_flags` text,
	`reasoning` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `symptom_checks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`age` int,
	`blood_group` varchar(10),
	`allergies` text,
	`chronic_conditions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_user_id_unique` UNIQUE(`user_id`)
);
