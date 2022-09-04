
alter table "public"."interaction_events" rename to "user_events";

alter table "public"."user_events" alter column "data" set not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."user_events" add column "updated_at" timestamptz
--  null default now();
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
-- CREATE TRIGGER "set_public_user_events_updated_at"
-- BEFORE UPDATE ON "public"."user_events"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_user_events_updated_at" ON "public"."user_events"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."user_events" alter column "profile_id" set not null;

alter table "public"."user_events" alter column "org_id" set not null;

alter table "public"."user_events" alter column "circle_id" set not null;

alter table "public"."user_events" alter column "user_id" set not null;

alter table "public"."user_events" rename column "profile_id" to "profile_id_hashed";

alter table "public"."user_events" rename column "user_id" to "user_id_hashed";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."user_events" add column "event_subtype" text
--  null;

alter table "public"."user_events" rename column "event_type" to "event_name";

DROP TABLE "public"."user_events";
