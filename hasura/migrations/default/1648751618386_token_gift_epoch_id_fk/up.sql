alter table "public"."token_gifts"
  add constraint "token_gifts_epoch_id_fkey"
  foreign key ("epoch_id")
  references "public"."epoches"
  ("id") on update no action on delete no action;

