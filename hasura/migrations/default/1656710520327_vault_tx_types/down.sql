
alter table "public"."vault_transactions" drop constraint "vault_transactions_tx_type_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- insert into vault_tx_types values ('Deposit'),('Withdraw'),('Distribution');

DROP TABLE "public"."vault_tx_types";

DROP TABLE "public"."vault_transactions";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."vault_transactions";
