

alter table "public"."nft_collections" drop constraint "nft_collections_pkey";
alter table "public"."nft_collections"
    add constraint "nft_collections_pkey"
    primary key ("address");

alter table "public"."nft_holdings" drop constraint "nft_holdings_chain_id_contract_fkey",
  add constraint "nft_holdings_contract_fkey"
  foreign key ("contract")
  references "public"."nft_collections"
  ("address") on update cascade on delete cascade;

alter table "public"."nft_collections" drop constraint "nft_collections_chain_id_address_key";

alter table "public"."nft_holdings" drop constraint "nft_holdings_pkey";
alter table "public"."nft_holdings"
    add constraint "nft_holdings_pkey"
    primary key ("chain_id", "contract", "token_id", "address");

alter table "public"."nft_holdings" drop constraint "nft_holdings_pkey";
alter table "public"."nft_holdings"
    add constraint "nft_holdings_pkey"
    primary key ("address", "contract", "token_id");

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."nft_holdings" add column "chain_id" integer
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."nft_collections" add column "chain_id" integer
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE VIEW shared_nfts AS
-- SELECT t1.address as address, t2.address as other_address, COUNT(DISTINCT t1.contract) AS shared_count
-- FROM nft_holdings t1
-- JOIN nft_holdings t2 ON t1.contract = t2.contract AND t1.address != t2.address
-- GROUP BY t1.address, t2.address
-- ORDER BY t1.address, shared_count DESC;

alter table "public"."nft_collections" alter column "slug" set not null;

alter table "public"."nft_holdings" alter column "profile_id" drop not null;
alter table "public"."nft_holdings" add column "profile_id" int8;

alter table "public"."nft_holdings" drop constraint "nft_holdings_address_contract_token_id_key";

alter table "public"."nft_holdings" drop constraint "nft_holdings_address_fkey";

alter table "public"."nft_holdings"
  add constraint "nft_holdings_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profiles"
  ("id") on update cascade on delete cascade;

alter table "public"."nft_holdings" drop constraint "nft_holdings_pkey";
alter table "public"."nft_holdings"
    add constraint "nft_holdings_pkey"
    primary key ("token_id", "profile_id", "contract");

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."nft_holdings" add column "address" citext
--  not null;

ALTER TABLE "public"."nft_holdings" ALTER COLUMN "token_id" TYPE integer;

alter table "public"."nft_holdings" drop constraint "nft_holdings_contract_fkey";

DROP TABLE "public"."nft_holdings";

DROP TABLE "public"."nft_collections";
