DROP INDEX IF EXISTS `users_sub_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `googleUserId` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleUserId_unique` ON `users` (`googleUserId`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `sub`;