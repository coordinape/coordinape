CREATE TABLE "public"."locked_token_distributions" (
  "id" bigserial NOT NULL, 
  "epoch_id" bigint NOT NULL, 
  "gift_amount" numeric NOT NULL, 
  "tx_hash" varchar, 
  "distribution_json" jsonb NOT NULL, 
  "distributed_by" bigint NOT NULL, 
  PRIMARY KEY ("id") , 
  FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") 
    ON UPDATE restrict ON DELETE restrict, 
  FOREIGN KEY ("distributed_by") REFERENCES "public"."profiles"  ("id") 
    ON UPDATE restrict ON DELETE restrict
);
