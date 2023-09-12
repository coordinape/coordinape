
-- need this extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."emails" (
    "email" citext NOT NULL,
    "profile_id" integer NOT NULL,
    "verified_at" timestamp null,
    "primary" boolean NOT NULL DEFAULT true,
    "verification_code" uuid not null default gen_random_uuid(),
    PRIMARY KEY ("email","profile_id"),
    FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade
);

