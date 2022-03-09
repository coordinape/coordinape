CREATE TABLE "public"."vaults"
(
  "id" bigserial NOT NULL,
  "token_address" varchar,
  "simple_token_address" varchar,
  "type" integer NOT NULL,
  "vault_address" varchar,
  "org_id" bigint NOT NULL,
  "decimals" integer NOT NULL,
  "owner_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("org_id") REFERENCES "public"."protocols"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
);
