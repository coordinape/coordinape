alter table "public"."token_balances" add constraint "token_balances_address_chain_contract_key" unique ("address", "chain", "contract");
