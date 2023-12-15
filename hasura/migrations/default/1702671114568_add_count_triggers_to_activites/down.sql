alter table "public"."activities" drop column "reaction_count";
alter table "public"."activities" drop column "reply_count";

DROP FUNCTION IF EXISTS update_reply_count();
DROP FUNCTION IF EXISTS update_reaction_count();
DROP INDEX IF EXISTS "public"."activites_index_contribution_id";
DROP INDEX IF EXISTS "public"."contributions_index_profile_id_private_stream";