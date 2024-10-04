CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending',
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`googleUserId` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE INDEX `idx_status` ON `todo` (`status`);--> statement-breakpoint
CREATE INDEX `idx_userId` ON `todo` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleUserId_unique` ON `users` (`googleUserId`);--> statement-breakpoint
CREATE INDEX `idx_googleUserId` ON `users` (`googleUserId`);