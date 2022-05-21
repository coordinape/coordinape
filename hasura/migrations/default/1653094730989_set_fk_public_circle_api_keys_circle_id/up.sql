alter table "public"."circle_api_keys"
  add constraint "circle_api_keys_circle_id_fkey"
  foreign key ("circle_id")
  references "public"."circles"
  ("id") on update restrict on delete cascade;
