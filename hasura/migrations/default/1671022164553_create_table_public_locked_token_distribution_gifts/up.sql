CREATE TABLE "public"."locked_token_distribution_gifts" (
  "id" bigserial NOT NULL, 
  "locked_token_distribution_id" bigint NOT NULL, 
  "profile_id" bigint NOT NULL, 
  "earnings" numeric NOT NULL,
  PRIMARY KEY ("id") , 
  FOREIGN KEY ("locked_token_distribution_id") REFERENCES "public"."locked_token_distributions"("id") ON UPDATE cascade ON DELETE cascade, 
  FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade);
alter table "public"."locked_token_distributions" drop column "distribution_json" cascade;
alter table "public"."locked_token_distributions" add column "chain_id" integer not null default 1;
alter table "public"."locked_token_distributions" add column "token_contract_address" varchar null;
alter table "public"."locked_token_distributions" add column "token_symbol" varchar null;
alter table "public"."locked_token_distributions" add column "token_decimals" integer not null default 18;