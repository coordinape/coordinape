alter table "public"."epoches"
  add constraint "epoches_circle_pgives_id_fkey"
  foreign key ("circle_pgives_id")
  references "public"."circle_pgives"
  ("id") on update restrict on delete restrict;
