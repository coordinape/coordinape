ALTER TABLE "public"."key_tx" ALTER COLUMN "subject_fee_amount" TYPE numeric USING "subject_fee_amount"::numeric;
ALTER TABLE "public"."key_tx" ALTER COLUMN "protocol_fee_amount" TYPE numeric USING "protocol_fee_amount"::numeric;
ALTER TABLE "public"."key_tx" ALTER COLUMN "eth_amount" TYPE numeric USING "eth_amount"::numeric;
ALTER TABLE "public"."key_tx" ALTER COLUMN "share_amount" TYPE numeric USING "share_amount"::numeric;

