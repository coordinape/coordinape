alter table "public"."activities"
  add constraint "activities_cast_id_fkey"
  foreign key ("cast_id")
  references "public"."enriched_casts"
  ("id") on update cascade on delete cascade;
