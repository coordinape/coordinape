alter table "public"."organizations"
  add constraint "organizations_created_by_fkey"
  foreign key ("created_by")
  references "public"."profiles"
  ("id") on update restrict on delete restrict;
