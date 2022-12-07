CREATE TABLE "discord"."circle_api_tokens" (
  "id" bigserial NOT NULL,
  "token" text,
  "channel_snowflake" text NOT NULL,
  "circle_id" bigint NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("token"),
  UNIQUE ("circle_id"),
  UNIQUE ("id")
);
COMMENT ON TABLE "discord"."circle_api_tokens" IS E'tokens the discord bot uses to operate on circles';
