
alter table "public"."vault_transactions" drop constraint "vault_transactions_tx_type_fkey";

-- could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- insert into vault_tx_types values ('Deposit'),('Withdraw'),('Distribution');

DROP TABLE IF EXISTS "public"."vault_tx_types";

DROP TABLE IF EXISTS "public"."vault_transactions";
