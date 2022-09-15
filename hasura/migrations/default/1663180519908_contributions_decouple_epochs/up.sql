DROP TABLE IF EXISTS "public"."contributions";

CREATE TABLE "public"."contributions"
(
  "id" bigserial NOT NULL,
  "circle_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "description" text NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);

CREATE TRIGGER "set_public_contributions_updated_at" BEFORE
UPDATE
  ON "public"."contributions"
  FOR EACH ROW
   EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"
   ();

COMMENT ON TRIGGER "set_public_contributions_updated_at" ON "public"."contributions"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
