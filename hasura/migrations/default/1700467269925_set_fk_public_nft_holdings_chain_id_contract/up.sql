alter table "public"."nft_holdings" drop constraint "nft_holdings_contract_fkey",
  add constraint "nft_holdings_chain_id_contract_fkey"
  foreign key ("chain_id", "contract")
  references "public"."nft_collections"
  ("chain_id", "address") on update cascade on delete cascade;
