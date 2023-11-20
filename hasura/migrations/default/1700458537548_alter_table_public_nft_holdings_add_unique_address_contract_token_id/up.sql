alter table "public"."nft_holdings" add constraint "nft_holdings_address_contract_token_id_key" unique ("address", "contract", "token_id");
