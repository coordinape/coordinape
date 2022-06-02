CREATE TABLE "discord"."users" ("id" bigserial NOT NULL, "user_snowflake" text NOT NULL, "profile_id" int8 NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("user_snowflake"), UNIQUE ("profile_id"));COMMENT ON TABLE "discord"."users" IS E'link discord user ids to coordinape profiles 1:1';
CREATE OR REPLACE FUNCTION "discord"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_discord_users_updated_at"
BEFORE UPDATE ON "discord"."users"
FOR EACH ROW
EXECUTE PROCEDURE "discord"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_discord_users_updated_at" ON "discord"."users" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
