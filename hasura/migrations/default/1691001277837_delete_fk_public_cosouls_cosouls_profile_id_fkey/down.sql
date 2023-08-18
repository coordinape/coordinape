alter table "public"."cosouls"
  add constraint "cosouls_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profiles"
  ("id") on update cascade on delete restrict;
