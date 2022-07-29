alter table "public"."circle_share_token"
  add constraint "circle_share_token_circle_id_fkey"
  foreign key ("circle_id")
  references "public"."circles"
  ("id") on update restrict on delete restrict;
