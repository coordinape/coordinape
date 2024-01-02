alter table "public"."activities" drop constraint "enforce_foreign_key_exists";
alter table "public"."activities" add constraint "enforce_foreign_key_exists" check (circle_id IS NOT NULL OR target_profile_id IS NOT NULL OR epoch_id IS NOT NULL OR contribution_id IS NOT NULL OR user_id IS NOT NULL OR big_question_id IS NOT NULL);
