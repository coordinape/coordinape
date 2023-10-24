
ALTER TABLE "public"."key_tx" ALTER COLUMN "subject_fee_amount" TYPE numeric;

ALTER TABLE "public"."key_tx" ALTER COLUMN "protocol_fee_amount" TYPE numeric;

ALTER TABLE "public"."key_tx" ALTER COLUMN "eth_amount" TYPE numeric;

ALTER TABLE "public"."key_tx" ALTER COLUMN "share_amount" TYPE numeric;
