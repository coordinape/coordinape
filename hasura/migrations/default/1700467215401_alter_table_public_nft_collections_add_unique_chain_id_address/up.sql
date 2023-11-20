alter table "public"."nft_collections" add constraint "nft_collections_chain_id_address_key" unique ("chain_id", "address");
