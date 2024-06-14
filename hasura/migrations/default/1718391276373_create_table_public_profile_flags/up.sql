
CREATE TABLE "public"."profile_flags" ("farcaster_checked_at" timestamptz, "profile_id" integer NOT NULL, PRIMARY KEY ("profile_id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade);COMMENT ON TABLE "public"."profile_flags" IS E'internal timestamp and/or boolean data about a profile';

ALTER TABLE "public"."profile_flags" ALTER COLUMN "profile_id" TYPE int8;

alter table "public"."profile_flags" rename column "farcaster_checked_at" to "farcaster_connect_checked_at";

alter table "public"."profile_flags" add column "farcaster_connect_error" text null;
