CREATE TABLE "discord"."user_api_tokens" (
  "id" bigserial NOT NULL,
  "profile_id" bigint NOT NULL,
  "circle_id" bigint NOT NULL,
  "discord_user" bigint,
  "token" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY ("discord_user") REFERENCES "discord"."users"("id") ON UPDATE cascade ON DELETE cascade,
  UNIQUE ("profile_id", "circle_id"),
  UNIQUE ("id")
);
COMMENT ON TABLE "discord"."user_api_tokens" IS E'User api tokens, one per circle';

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
CREATE TRIGGER "set_discord_user_api_tokens_updated_at"
BEFORE UPDATE ON "discord"."user_api_tokens"
FOR EACH ROW
EXECUTE PROCEDURE "discord"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_discord_user_api_tokens_updated_at" ON "discord"."user_api_tokens" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
