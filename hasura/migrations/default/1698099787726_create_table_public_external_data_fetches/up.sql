CREATE TABLE "public"."external_data_fetches" ("id" bigserial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "address" citext NOT NULL, "profile_id" integer NOT NULL, "poap_synced_at" timestamptz, PRIMARY KEY ("id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade);COMMENT ON TABLE "public"."external_data_fetches" IS E'Tracking table for fetching profile data from external sources';
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
CREATE TRIGGER "set_public_external_data_fetches_updated_at"
BEFORE UPDATE ON "public"."external_data_fetches"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_external_data_fetches_updated_at" ON "public"."external_data_fetches"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
