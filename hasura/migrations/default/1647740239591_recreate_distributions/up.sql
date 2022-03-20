
CREATE TABLE "public"."distributions" ("id" bigserial NOT NULL, "epoch_id" bigint NOT NULL, "merkle_root" varchar, "vault_id" bigint NOT NULL, "total_amount" numeric NOT NULL, "created_at" timestamp NOT NULL DEFAULT now(), "created_by" bigint NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE no action ON DELETE no action, UNIQUE ("id"));COMMENT ON TABLE "public"."distributions" IS E'Vault Distributions';

alter table "public"."claims" add column "distribution_id" bigint
 not null;

alter table "public"."claims"
  add constraint "claims_distribution_id_fkey"
  foreign key ("distribution_id")
  references "public"."distributions"
  ("id") on update no action on delete no action;

ALTER TABLE "public"."claims" ALTER COLUMN "amount" TYPE numeric;
