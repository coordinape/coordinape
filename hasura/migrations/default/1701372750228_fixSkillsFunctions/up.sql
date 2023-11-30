DROP TRIGGER IF EXISTS "trigger_profile_skills_insert" on "public"."profile_skills";
DROP TRIGGER IF EXISTS "trigger_profile_skills_update" on "public"."profile_skills";
DROP TRIGGER IF EXISTS "trigger_profile_skills_delete" on "public"."profile_skills";
DROP FUNCTION IF EXISTS public.update_skill_count();


CREATE OR REPLACE FUNCTION public.insert_update_skill_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "public"."skills"
  SET "count" = (SELECT COUNT(*) FROM "public"."profile_skills" WHERE "skill_name" = NEW."skill_name")
  WHERE "name" = NEW."skill_name";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.delete_update_skill_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "public"."skills"
  SET "count" = (SELECT COUNT(*) FROM "public"."profile_skills" WHERE "skill_name" = OLD."skill_name")
  WHERE "name" = OLD."skill_name";
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trigger_profile_skills_delete"
AFTER DELETE ON "public"."profile_skills"
FOR EACH ROW
EXECUTE FUNCTION public.delete_update_skill_count();

CREATE TRIGGER "trigger_profile_skills_insert"
AFTER INSERT ON "public"."profile_skills"
FOR EACH ROW
EXECUTE FUNCTION public.insert_update_skill_count();
