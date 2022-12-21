DROP TABLE "public"."locked_token_distribution_gifts";
alter table "public"."locked_token_distributions" add column "distribution_json" jsonb;
alter table "public"."locked_token_distributions" drop column "chain_id" cascade;
alter table "public"."locked_token_distributions" drop column "token_contract_address" cascade;
alter table "public"."locked_token_distributions" drop column "token_symbol" cascade;
alter table "public"."locked_token_distributions" drop column "token_decimals" cascade;
