BEGIN TRANSACTION;
ALTER TABLE "public"."nft_collections" DROP CONSTRAINT "nft_collections_pkey";

ALTER TABLE "public"."nft_collections"
    ADD CONSTRAINT "nft_collections_pkey" PRIMARY KEY ("address", "chain_id");
COMMIT TRANSACTION;
