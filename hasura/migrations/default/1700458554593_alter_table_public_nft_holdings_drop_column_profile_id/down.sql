alter table "public"."nft_holdings" alter column "profile_id" drop not null;
alter table "public"."nft_holdings" add column "profile_id" int8;
