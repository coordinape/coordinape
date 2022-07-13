-- add deployment_block column
alter table "public"."vaults" add column if not exists "deployment_block" bigint
 default 6800000 -- a pre-testing block on goerli; still valid on mainnet
 not null;

-- It's easier to drop and recreate the table wholesale
DROP table IF EXISTS "public"."vault_transactions";

CREATE TABLE "public"."vault_transactions" (
  "id" bigserial NOT NULL,
  "tx_hash" text NOT NULL,
  "vault_id" bigint NOT NULL,
  "tx_type" text NOT NULL,
  "created_by" bigint,
  "distribution_id" bigint,
  "circle_id" bigint,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("distribution_id") REFERENCES "public"."distributions"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id")
);
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

CREATE TRIGGER "set_public_vault_transactions_updated_at"
BEFORE UPDATE ON "public"."vault_transactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_vault_transactions_updated_at" ON "public"."vault_transactions"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."vault_tx_types" ("value" text NOT NULL, "comment" text, PRIMARY KEY ("value") , UNIQUE ("value"));

insert into vault_tx_types values ('Deposit'),('Withdraw'),('Distribution');

alter table "public"."vault_transactions"
  add constraint "vault_transactions_tx_type_fkey"
  foreign key ("tx_type")
  references "public"."vault_tx_types"
  ("value") on update restrict on delete restrict;
