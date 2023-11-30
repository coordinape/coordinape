DROP TRIGGER IF EXISTS "trigger_profile_skills_insert" on "public"."profile_skills";
DROP TRIGGER IF EXISTS "trigger_profile_skills_delete" on "public"."profile_skills";
DROP FUNCTION IF EXISTS public.insert_update_skill_count();
DROP FUNCTION IF EXISTS public.delete_update_skill_count();
