
ALTER TABLE "public"."claims" ALTER COLUMN "amount" TYPE bigint;

alter table "public"."claims" drop constraint "claims_distribution_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "distribution_id" bigint
--  not null;

DROP TABLE "public"."distributions";
