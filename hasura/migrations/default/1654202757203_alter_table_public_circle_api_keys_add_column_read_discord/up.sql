alter table "public"."circle_api_keys" add column "read_discord" boolean
 not null default 'false';
