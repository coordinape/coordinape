CREATE TABLE "public"."interaction_events" (
  "user_id" integer NULL,
  "profile_id" integer NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NULL DEFAULT now(),
  "event_type" text NOT NULL,
  "event_subtype" text NULL,
  "data" jsonb NULL,
  "circle_id" integer NULL,
  "org_id" integer NULL,
  "id" serial NOT NULL,
  PRIMARY KEY ("id")
);

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"
()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW
();
RETURN _new;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_interaction_events_updated_at" BEFORE
UPDATE
  ON "public"."interaction_events"
  FOR EACH ROW
   EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"
   ();

COMMENT ON TRIGGER "set_public_interaction_events_updated_at" ON "public"."interaction_events"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';