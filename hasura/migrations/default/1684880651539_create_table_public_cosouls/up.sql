CREATE TABLE
  "public"."cosouls" (
    "id" serial NOT NULL,
    "profile_id" integer NOT NULL,
    "profile_address" integer NULL,
    "token_id" integer NULL,
    "created_tx_hash" varchar(66) NOT NULL,
    "pgive" integer NULL,
    "synced_at" timestamptz NULL,
    "created_at" timestamptz NOT NULL DEFAULT now (),
    "updated_at" timestamptz NOT NULL DEFAULT now (),
    PRIMARY KEY ("id", "profile_id"),
    FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON UPDATE cascade ON DELETE restrict,
    UNIQUE ("token_id")
  );
COMMENT ON TABLE "public"."cosouls" IS E'local db copy of last synced on-chain cosoul data';
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
CREATE TRIGGER "set_public_cosouls_updated_at"
BEFORE UPDATE ON "public"."cosouls"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_cosouls_updated_at" ON "public"."cosouls" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
