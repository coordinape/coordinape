CREATE  INDEX "colinks_gives_target_profile_id_activity_id_profile_id_cast_has" on
  "public"."colinks_gives" using btree ("activity_id", "cast_hash", "profile_id", "target_profile_id");
