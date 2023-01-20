
alter table "discord"."roles_circles" rename column "server_role" to "discord_role_id";

alter table "discord"."roles_circles" add column "discord_channel_id" text
 not null;
