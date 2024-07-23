alter table "public"."colinks_gives" add constraint "give_object_constraint" check (CHECK (activity_id IS NOT NULL OR cast_hash IS NOT NULL));
