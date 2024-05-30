
CREATE TABLE "public"."farcaster_accounts" ("profile_id" bigint NOT NULL, "fid" bigint NOT NULL, "username" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "followers_count" integer NOT NULL, "following_count" integer NOT NULL, "name" text NOT NULL, PRIMARY KEY ("profile_id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_farcaster_accounts_updated_at"
BEFORE UPDATE ON "public"."farcaster_accounts"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_farcaster_accounts_updated_at" ON "public"."farcaster_accounts"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."farcaster_accounts" add column "pfp_url" text
 null;

alter table "public"."farcaster_accounts" add column "custody_address" text
 not null unique;
