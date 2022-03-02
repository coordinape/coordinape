CREATE TABLE "public"."distributions"
(
  "id" bigint NOT NULL,
  "epoch_id" bigint NOT NULL,
  "merkle_root" varchar NOT NULL,
  "total_amount" varchar NOT NULL,
  "vault_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "created_at" Timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
);
