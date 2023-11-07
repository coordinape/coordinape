
CREATE TABLE "public"."linkedin_account" ("profile_id" int8 NOT NULL, "sub" text NOT NULL, "email_verified" boolean NOT NULL, "name" text NOT NULL, "country" text NOT NULL, "language" text NOT NULL, "given_name" text NOT NULL, "family_name" text NOT NULL, "email" text NOT NULL, "picture" text, PRIMARY KEY ("profile_id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("profile_id"), UNIQUE ("sub"));

alter table "public"."linkedin_account" add column "created_at" timestamptz
 not null default now();

alter table "public"."linkedin_account" add column "updated_at" timestamptz
 not null default now();

alter table "public"."linkedin_account" add column "access_token" text
 not null;

alter table "public"."linkedin_account" add column "expires_in" int8
 not null;

alter table "public"."linkedin_account" add column "scope" text
 not null;

alter table "public"."reputation_scores" add column "linkedin_score" integer
 not null default '0';

CREATE TRIGGER "set_public_linkedin_account_updated_at" BEFORE
UPDATE ON "public"."linkedin_account" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at" ();

COMMENT ON TRIGGER "set_public_linkedin_account_updated_at" ON "public"."linkedin_account" IS E'trigger to set value of column "updated_at" to current timestamp on row update';
