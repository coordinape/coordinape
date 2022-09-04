
CREATE TABLE "public"."user_events" ("user_id_hashed" integer NOT NULL, "profile_id_hashed" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "event_name" text NOT NULL, "data" jsonb NOT NULL, "circle_id" integer NOT NULL, "org_id" integer NOT NULL, "id" serial NOT NULL, PRIMARY KEY ("id") );

alter table "public"."user_events" rename column "event_name" to "event_type";

alter table "public"."user_events" add column "event_subtype" text
 null;

alter table "public"."user_events" rename column "user_id_hashed" to "user_id";

alter table "public"."user_events" rename column "profile_id_hashed" to "profile_id";

alter table "public"."user_events" alter column "user_id" drop not null;

alter table "public"."user_events" alter column "circle_id" drop not null;

alter table "public"."user_events" alter column "org_id" drop not null;

alter table "public"."user_events" alter column "profile_id" drop not null;

alter table "public"."user_events" add column "updated_at" timestamptz
 null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_user_events_updated_at"
BEFORE UPDATE ON "public"."user_events"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_events_updated_at" ON "public"."user_events" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."user_events" alter column "data" drop not null;

alter table "public"."user_events" rename to "interaction_events";
