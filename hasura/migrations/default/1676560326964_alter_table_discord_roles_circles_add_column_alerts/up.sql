alter table "discord"."roles_circles" add column "alerts" jsonb
 not null default '{}';
