
alter table "public"."vaults" alter column "type" drop not null;
alter table "public"."vaults" add column "type" varchar;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "symbol" varchar
--  not null;

DROP TABLE "public"."claims";

DROP TABLE "public"."distributions";

DROP TABLE "public"."vault_transactions";

DROP TABLE "public"."vaults";

DROP TABLE "public"."circle_integrations";
