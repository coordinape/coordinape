alter table "public"."colinks_gives" add constraint "colinks_gives_activity_id_target_profile_id_profile_id_cast_hash_key" unique ("activity_id", "target_profile_id", "profile_id", "cast_hash");
