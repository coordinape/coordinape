CREATE TABLE "public"."vault_transactions"
(
  "id" bigserial NOT NULL,
  "name" varchar NOT NULL,
  "tx_hash" varchar NOT NULL,
  "description" varchar NULL,
  "value" bigint,
  "date" Date NOT NULL,
  "vault_id" bigint NOT NULL,
  "created_by" bigint,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
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
CREATE TRIGGER "set_public_vault_transactions_updated_at"
BEFORE
UPDATE ON "public"."vault_transactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"
."set_current_timestamp_updated_at"
();
COMMENT ON TRIGGER "set_public_vault_transactions_updated_at" ON "public"."vault_transactions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
