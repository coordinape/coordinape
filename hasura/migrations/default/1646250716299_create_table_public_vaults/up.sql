CREATE TABLE "public"."vaults"
(
  "id" bigserial NOT NULL,
  "token_address" varchar,
  "simple_token_address" varchar,
  "type" integer NOT NULL,
  "org_id" bigint NOT NULL,
  "decimals" integer NOT NULL,
  "owner_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("org_id") REFERENCES "public"."protocols"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
);
