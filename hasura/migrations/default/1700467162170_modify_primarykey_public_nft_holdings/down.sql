alter table "public"."nft_holdings" drop constraint "nft_holdings_pkey";
alter table "public"."nft_holdings"
    add constraint "nft_holdings_pkey"
    primary key ("address", "contract", "token_id");
