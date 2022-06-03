alter table "public"."distributions" rename column "tx_hash" to "saved_on_chain";
alter table "public"."distributions" alter column "saved_on_chain" set not null;
alter table "public"."distributions" alter column "saved_on_chain" set default 'false';
ALTER TABLE "public"."distributions" ALTER COLUMN "saved_on_chain" TYPE boolean;
