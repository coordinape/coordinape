
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "updated_at" timestamptz
--  not null default now();
--
-- CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER "set_public_vaults_updated_at"
-- BEFORE UPDATE ON "public"."vaults"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_vaults_updated_at" ON "public"."vaults"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "created_at" timestamptz
--  not null default now();

alter table "public"."vaults" alter column "updated_at" set default now();
alter table "public"."vaults" alter column "updated_at" drop not null;
alter table "public"."vaults" add column "updated_at" timestamp;

alter table "public"."vaults" alter column "created_at" set default now();
alter table "public"."vaults" alter column "created_at" drop not null;
alter table "public"."vaults" add column "created_at" timestamp;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "symbol" Text
--  null;

alter table "public"."vaults" alter column "type" drop not null;
alter table "public"."vaults" add column "type" int4;
