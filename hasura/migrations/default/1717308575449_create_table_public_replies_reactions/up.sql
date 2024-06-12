CREATE TABLE "public"."replies_reactions" ("id" bigserial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "reply_id" integer NOT NULL, "activity_id" integer NOT NULL, "profile_id" integer NOT NULL, "reaction" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
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
CREATE TRIGGER "set_public_replies_reactions_updated_at"
BEFORE UPDATE ON "public"."replies_reactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_replies_reactions_updated_at" ON "public"."replies_reactions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE  INDEX "replies_reactions_index_profile_id" on
  "public"."replies_reactions" using btree ("profile_id");

CREATE  INDEX "replies_reactions_index_reply_id" on
  "public"."replies_reactions" using btree ("reply_id");

CREATE  INDEX "replies_reactions_index_activity_id" on
  "public"."replies_reactions" using btree ("activity_id");

ALTER TABLE "public"."replies_reactions"
  ADD CONSTRAINT "replies_reactions_reply_id_fkey"
  FOREIGN KEY ("reply_id")
  REFERENCES "public"."replies"
  ("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."replies_reactions"
  ADD CONSTRAINT "replies_reactions_activity_id_fkey"
  FOREIGN KEY ("activity_id")
  REFERENCES "public"."activities"
  ("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."replies_reactions"
  ADD CONSTRAINT "replies_reactions_profile_id_reply_id_reaction_key" UNIQUE ("profile_id", "reply_id", "reaction");
