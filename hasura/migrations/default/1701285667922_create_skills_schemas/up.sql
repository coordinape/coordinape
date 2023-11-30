CREATE TABLE "public"."skills" (
  "name" citext NOT NULL,
  "count" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
   PRIMARY KEY ("name")
);

CREATE TABLE "public"."profile_skills" (
  "skill_name" citext NOT NULL,
  "profile_id" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("skill_name", "profile_id"));

CREATE INDEX idx_profile_skills_skill_name ON "public"."profile_skills"("skill_name");

ALTER TABLE "public"."profile_skills"
ADD CONSTRAINT "fk_profile_skills_profile"
FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id");

ALTER TABLE "public"."profile_skills"
ADD CONSTRAINT "fk_profile_skills_skill"
FOREIGN KEY ("skill_name") REFERENCES "public"."skills" ("name");

CREATE TRIGGER "set_public_skills_updated_at"
BEFORE UPDATE ON "public"."skills"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_skills_updated_at" ON "public"."skills"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE OR REPLACE FUNCTION public.update_skill_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "public"."skills"
  SET "count" = (SELECT COUNT(*) FROM "public"."profile_skills" WHERE "skill_name" = NEW."skill_name")
  WHERE "name" = NEW."skill_name";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trigger_profile_skills_insert"
AFTER INSERT ON "public"."profile_skills"
FOR EACH ROW
EXECUTE FUNCTION public.update_skill_count();

CREATE TRIGGER "trigger_profile_skills_update"
AFTER UPDATE ON "public"."profile_skills"
FOR EACH ROW
EXECUTE FUNCTION public.update_skill_count();

CREATE TRIGGER "trigger_profile_skills_delete"
AFTER DELETE ON "public"."profile_skills"
FOR EACH ROW
EXECUTE FUNCTION public.update_skill_count();
