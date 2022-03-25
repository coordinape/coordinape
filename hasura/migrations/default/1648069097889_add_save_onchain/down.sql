
alter table "public"."vaults" alter column "symbol" drop not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."distributions" add column "saved_on_chain" boolean
--  not null default 'false';
