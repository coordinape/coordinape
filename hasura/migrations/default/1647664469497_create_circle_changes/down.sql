
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circles" add column "contact" text
--  null;

alter table "public"."circles" drop column "contact";

alter table "public"."protocols" alter column "updated_at" drop not null;

alter table "public"."protocols" alter column "created_at" drop not null;

alter table "public"."circles" alter column "protocol_id" drop not null;

alter table "public"."circles" alter column "updated_at" drop not null;

alter table "public"."circles" alter column "created_at" drop not null;
