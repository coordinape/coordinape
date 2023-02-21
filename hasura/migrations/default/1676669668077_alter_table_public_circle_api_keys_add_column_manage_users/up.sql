alter table "public"."circle_api_keys" add column "manage_users" boolean
 not null default 'false';
