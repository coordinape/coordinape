alter table "public"."nominees"
  add constraint "nominees_circle_id_fkey"
  foreign key ("circle_id")
  references "public"."circles"
  ("id") on update no action on delete no action;

alter table "public"."vouches"
  add constraint "vouches_voucher_id_fkey"
  foreign key ("voucher_id")
  references "public"."users"
  ("id") on update no action on delete no action;

alter table "public"."vouches"
  add constraint "vouches_nominee_id_fkey"
  foreign key ("nominee_id")
  references "public"."nominees"
  ("id") on update no action on delete no action;
