
alter table "public"."distributions" alter column "updated_at" set default now();
alter table "public"."distributions" alter column "updated_at" drop not null;
alter table "public"."distributions" add column "updated_at" timestamp;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."distributions" add column "total_amount" numeric
--  not null;

alter table "public"."distributions" alter column "total_amount" drop not null;
alter table "public"."distributions" add column "total_amount" varchar;
