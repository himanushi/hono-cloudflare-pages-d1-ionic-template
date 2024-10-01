ALTER TABLE `users` ADD `sub` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_sub_unique` ON `users` (`sub`);