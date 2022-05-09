alter table "public"."users"
  add constraint "users_address_fkey"
  foreign key ("address")
  references "public"."profiles"
  ("address") on update restrict on delete restrict;
