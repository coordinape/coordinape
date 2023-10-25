CREATE TABLE "public"."external_data_fetches" ("id" bigserial NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "address" citext UNIQUE NOT NULL,
  "poap_synced_at" timestamptz,
  PRIMARY KEY ("id"));

COMMENT ON TABLE "public"."external_data_fetches" IS E'Tracking table for fetching data from external sources';

CREATE TRIGGER "set_public_external_data_fetches_updated_at"
BEFORE UPDATE ON "public"."external_data_fetches"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_external_data_fetches_updated_at" ON "public"."external_data_fetches"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
