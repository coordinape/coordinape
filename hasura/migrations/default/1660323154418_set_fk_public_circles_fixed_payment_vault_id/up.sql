alter table "public"."circles"
  add constraint "circles_fixed_payment_vault_id_fkey"
  foreign key ("fixed_payment_vault_id")
  references "public"."vaults"
  ("id") on update restrict on delete restrict;
