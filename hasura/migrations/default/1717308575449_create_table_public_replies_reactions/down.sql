ALTER TABLE "public"."replies_reactions" DROP CONSTRAINT "replies_reactions_profile_id_reply_id_reaction_key";
ALTER TABLE "public"."replies_reactions" DROP CONSTRAINT "replies_reactions_reply_id_fkey";
ALTER TABLE "public"."replies_reactions" DROP CONSTRAINT "replies_reactions_activity_id_fkey";
DROP INDEX IF EXISTS "public"."replies_reactions_index_profile_id";
DROP INDEX IF EXISTS "public"."replies_reactions_index_reply_id";
DROP INDEX IF EXISTS "public"."replies_reactions_index_activity_id";
DROP TABLE "public"."replies_reactions";
