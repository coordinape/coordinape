alter table "public"."nft_holdings"
  add constraint "nft_holdings_address_fkey"
  foreign key ("address")
  references "public"."profiles"
  ("address") on update cascade on delete cascade;
