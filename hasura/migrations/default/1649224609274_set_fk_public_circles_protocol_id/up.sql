alter table "public"."circles"
  add constraint "circles_protocol_id_fkey"
  foreign key ("protocol_id")
  references "public"."protocols"
  ("id") on update restrict on delete restrict;
