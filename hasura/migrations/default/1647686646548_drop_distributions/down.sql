
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."distributions";

alter table "public"."claims"
  add constraint "claims_distribution_id_fkey"
  foreign key (distribution_id)
  references "public"."distributions"
  (id) on update no action on delete no action;
alter table "public"."claims" alter column "distribution_id" drop not null;
alter table "public"."claims" add column "distribution_id" int8;
