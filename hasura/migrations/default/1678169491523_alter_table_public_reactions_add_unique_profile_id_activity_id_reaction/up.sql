alter table "public"."reactions" add constraint "reactions_profile_id_activity_id_reaction_key" unique ("profile_id", "activity_id", "reaction");
