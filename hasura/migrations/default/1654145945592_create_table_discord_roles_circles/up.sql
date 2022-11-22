CREATE SCHEMA IF NOT EXISTS discord;

CREATE TABLE "discord"."roles_circles" ("id" bigserial NOT NULL, "circle_id" int8 NOT NULL, "role" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("circle_id"));COMMENT ON TABLE "discord"."roles_circles" IS E'link a discord role to a circle  to control membership of the circle';
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
CREATE TRIGGER "set_discord_roles_circles_updated_at"
BEFORE UPDATE ON "discord"."roles_circles"
FOR EACH ROW
EXECUTE PROCEDURE "discord"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_discord_roles_circles_updated_at" ON "discord"."roles_circles"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
