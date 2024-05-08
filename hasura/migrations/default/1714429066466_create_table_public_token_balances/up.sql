CREATE TABLE "public"."token_balances" ("id" bigserial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "address" citext NOT NULL, "chain" text NOT NULL, "contract" text NOT NULL, "symbol" text NOT NULL, "balance" numeric NOT NULL DEFAULT 0, "last_checked_at" timestamptz, PRIMARY KEY ("id") );COMMENT ON TABLE "public"."token_balances" IS E'Balances of tokens for given address, chain, contract';
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
CREATE TRIGGER "set_public_token_balances_updated_at"
BEFORE UPDATE ON "public"."token_balances"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_token_balances_updated_at" ON "public"."token_balances"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
