CREATE TABLE "public"."address_data_fetches" (
  "address" citext NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "poap_synced_at" timestamptz,
  PRIMARY KEY ("address"));

COMMENT ON TABLE "public"."address_data_fetches" IS E'Tracking table for fetching data from address sources';

CREATE TRIGGER "set_public_address_data_fetches_updated_at"
BEFORE UPDATE ON "public"."address_data_fetches"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_address_data_fetches_updated_at" ON "public"."address_data_fetches"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

