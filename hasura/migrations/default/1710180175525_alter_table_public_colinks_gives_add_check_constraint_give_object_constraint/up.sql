alter table "public"."colinks_gives" add constraint "give_object_constraint" check (activity_id IS NOT NULL or cast_hash IS NOT NULL);
