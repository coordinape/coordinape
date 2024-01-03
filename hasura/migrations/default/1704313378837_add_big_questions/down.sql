

DROP INDEX IF EXISTS unique_contribution_per_big_question;
alter table "public"."contributions" drop constraint "contributions_big_question_id_fkey";
alter table "public"."contributions" drop column "big_question_id";

alter table "public"."activities" drop constraint "enforce_foreign_key_exists";
alter table "public"."activities" add constraint "enforce_foreign_key_exists" check (CHECK (circle_id IS NOT NULL OR target_profile_id IS NOT NULL OR epoch_id IS NOT NULL OR contribution_id IS NOT NULL OR user_id IS NOT NULL));
alter table "public"."activities" drop constraint "activities_big_question_id_fkey";
alter table "public"."activities" drop column "big_question_id";

DROP TABLE "public"."big_questions";
