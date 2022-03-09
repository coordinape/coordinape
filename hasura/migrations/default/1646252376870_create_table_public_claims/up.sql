CREATE TABLE "public"."claims"
(
  "id" bigserial NOT NULL,
  "distribution_id" bigint NOT NULL,
  "index" bigint NOT NULL,
  "proof" varchar NOT NULL,
  "address" varchar NOT NULL,
  "flag" boolean NOT NULL,
  "claimed" boolean NOT NULL,
  "amount" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("distribution_id") REFERENCES "public"."distributions"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
);
