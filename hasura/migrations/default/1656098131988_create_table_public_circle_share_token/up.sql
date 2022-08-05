CREATE TABLE "public"."circle_share_token" ("circle_id" bigint NOT NULL, "type" integer NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("circle_id","type") , UNIQUE ("uuid"));
--CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_circle_share_token_updated_at"
BEFORE UPDATE ON "public"."circle_share_token"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_circle_share_token_updated_at" ON "public"."circle_share_token" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
