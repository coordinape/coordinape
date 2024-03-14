alter table "public"."colinks_gives" drop constraint "colinks_gives_target_profile_id_activity_id_profile_id_cast_hash_key";
alter table "public"."colinks_gives" add constraint "colinks_gives_target_profile_id_activity_id_profile_id_key" unique ("target_profile_id", "activity_id", "profile_id");
