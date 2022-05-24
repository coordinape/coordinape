ALTER TABLE "public"."distributions" ALTER COLUMN "saved_on_chain" TYPE varchar;
ALTER TABLE "public"."distributions" ALTER COLUMN "saved_on_chain" drop default;
alter table "public"."distributions" alter column "saved_on_chain" drop not null;
alter table "public"."distributions" rename column "saved_on_chain" to "tx_hash";
