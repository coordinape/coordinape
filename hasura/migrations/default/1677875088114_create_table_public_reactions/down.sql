ALTER TABLE "public"."reactions" DROP CONSTRAINT "reactions_profile_id_activity_id_reaction_key";
DROP INDEX IF EXISTS "public"."reactions_index_profile_id";
DROP INDEX IF EXISTS "public"."reactions_index_activity_id";
DROP TABLE "public"."reactions";
