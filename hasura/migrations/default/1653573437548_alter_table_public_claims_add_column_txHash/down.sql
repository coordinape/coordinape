-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "txHash" varchar
--  null;
alter table "public"."claims" drop column "txHash";
