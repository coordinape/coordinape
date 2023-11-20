
CREATE TABLE "public"."nft_collections" ("address" citext NOT NULL, "name" text NOT NULL, "banner_image_url" text, "external_url" text, "slug" text,"chain_id" integer not null, PRIMARY KEY ("address","chain_id") , UNIQUE ("address","chain_id"));

CREATE TABLE "public"."nft_holdings" ("address" citext NOT NULL, "contract" citext NOT NULL, "token_id" text NOT NULL, "name" text, "image_url" text,"chain_id" integer not null, PRIMARY KEY ("address","contract","chain_id","token_id") , FOREIGN KEY ("address") REFERENCES "public"."profiles"("address") ON UPDATE cascade ON DELETE cascade, UNIQUE ("address", "contract", "token_id","chain_id"));


alter table "public"."nft_holdings"
  add constraint "nft_holdings_chain_id_contract_fkey"
  foreign key ("chain_id", "contract")
  references "public"."nft_collections"
  ("chain_id", "address") on update cascade on delete cascade;


alter table "public"."nft_holdings"
  add constraint "nft_holdings_address_fkey"
  foreign key ("address")
  references "public"."profiles"
  ("address") on update cascade on delete cascade;


CREATE VIEW shared_nfts AS
SELECT t1.address as address, t2.address as other_address, COUNT(DISTINCT t1.contract) AS shared_count
FROM nft_holdings t1
JOIN nft_holdings t2 ON t1.contract = t2.contract AND t1.address != t2.address
GROUP BY t1.address, t2.address
ORDER BY t1.address, shared_count DESC;
