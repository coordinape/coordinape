CREATE TABLE "public"."reactions" ("id" bigserial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "activity_id" integer NOT NULL, "profile_id" integer NOT NULL, "reaction" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
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
CREATE TRIGGER "set_public_reactions_updated_at"
BEFORE UPDATE ON "public"."reactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_reactions_updated_at" ON "public"."reactions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE  INDEX "reactions_index_profile_id" on
  "public"."reactions" using btree ("profile_id");


CREATE  INDEX "reactions_index_activity_id" on
  "public"."reactions" using btree ("activity_id");

ALTER TABLE "public"."reactions"
ADD CONSTRAINT "reactions_profile_id_activity_id_reaction_key" UNIQUE ("profile_id", "activity_id", "reaction");
