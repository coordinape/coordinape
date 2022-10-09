alter table "public"."claims" drop constraint "claims_distribution_id_fkey",
  add constraint "claims_distribution_id_fkey"
  foreign key ("distribution_id")
  references "public"."distributions"
  ("id") on update no action on delete no action;
