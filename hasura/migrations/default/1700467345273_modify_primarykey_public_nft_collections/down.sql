alter table "public"."nft_collections" drop constraint "nft_collections_pkey";
alter table "public"."nft_collections"
    add constraint "nft_collections_pkey"
    primary key ("address");
