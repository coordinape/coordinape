alter table "public"."nft_holdings"
  add constraint "nft_holdings_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profiles"
  ("id") on update cascade on delete cascade;
