alter table "public"."nft_holdings"
  add constraint "nft_holdings_contract_fkey"
  foreign key ("contract")
  references "public"."nft_collections"
  ("address") on update cascade on delete cascade;
