

CREATE TABLE "public"."twitter_account" ("username" text NOT NULL, "profile_id" integer NOT NULL, "access_token" text NOT NULL, "refresh_token" text NOT NULL, "expires_at" numeric NOT NULL, "name" text NOT NULL, "location" text, "url" text, "id" text NOT NULL, "profile_image_url" text, "verified" boolean, "followers_count" integer, "following_count" integer, "description" text, PRIMARY KEY ("profile_id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("profile_id"), UNIQUE ("username"), UNIQUE ("id"));COMMENT ON TABLE "public"."twitter_account" IS E'twitter accounts connected to profiles';

alter table "public"."twitter_account" add column "created_at" timestamptz
 not null default now();

alter table "public"."twitter_account" add column "twitter_created_at" timestamptz
 null;

alter table "public"."twitter_account" add column "updated_at" timestamptz
 not null default now();

CREATE TRIGGER "set_twitter_account_updated_at"
BEFORE UPDATE ON "public"."twitter_account"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_twitter_account_updated_at" ON "public"."twitter_account"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
