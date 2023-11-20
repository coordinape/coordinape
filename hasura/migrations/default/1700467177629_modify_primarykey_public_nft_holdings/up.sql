BEGIN TRANSACTION;
ALTER TABLE "public"."nft_holdings" DROP CONSTRAINT "nft_holdings_pkey";

ALTER TABLE "public"."nft_holdings"
    ADD CONSTRAINT "nft_holdings_pkey" PRIMARY KEY ("address", "contract", "token_id", "chain_id");
COMMIT TRANSACTION;
