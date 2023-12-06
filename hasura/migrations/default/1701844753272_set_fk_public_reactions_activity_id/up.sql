alter table "public"."reactions"
  add constraint "reactions_activity_id_fkey"
  foreign key ("activity_id")
  references "public"."activities"
  ("id") on update cascade on delete cascade;
