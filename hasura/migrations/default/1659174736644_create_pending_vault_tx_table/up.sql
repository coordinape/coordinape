

insert into vault_tx_types values ('Claim', null),('Vault_Deploy', 'Deployment of new vault onchain');

CREATE TABLE "public"."pending_vault_transactions"
(
  "tx_hash" text NOT NULL,
  "tx_type" text NOT NULL,
  "created_by" bigint NOT NULL,
  "chain_id" integer NOT NULL,
  "claim_id" bigint,
  "org_id" bigint,
  "distribution_id" bigint,
  "created_at" timestamp not null default now(),
  PRIMARY KEY ("tx_hash"),
  FOREIGN KEY ("tx_type") REFERENCES "public"."vault_tx_types"("value") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("org_id") REFERENCES "public"."protocols"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("distribution_id") REFERENCES "public"."distributions" ("id") on update restrict on delete restrict,
  UNIQUE ("tx_hash")
);
COMMENT ON TABLE "public"."pending_vault_transactions" IS E'stores app-specific context to aid in the recovery of incomplete transactions';
