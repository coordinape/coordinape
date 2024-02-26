CREATE TABLE "public"."colinks_gives" ("profile_id" int8 NOT NULL, "target_profile_id" int8 NOT NULL, "activity_id" int8 NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "skill" citext, "id" serial NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("skill") REFERENCES "public"."skills"("name") ON UPDATE cascade ON DELETE cascade, UNIQUE ("profile_id", "target_profile_id", "activity_id"));

CREATE TRIGGER "set_public_colinks_gives_updated_at"
BEFORE UPDATE ON "public"."colinks_gives"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_colinks_gives_updated_at" ON "public"."colinks_gives"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE  INDEX "colinks_gives_target_profile_id" on
  "public"."colinks_gives" using btree ("target_profile_id");

CREATE  INDEX "colinks_gives_activity_id" on
  "public"."colinks_gives" using btree ("activity_id");
