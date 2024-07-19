CREATE TABLE `tag_stash_ids` (
  `tag_id` integer,
  `endpoint` varchar(255),
  `stash_id` varchar(36),
  foreign key(`tag_id`) references `tags`(`id`) on delete CASCADE
);
