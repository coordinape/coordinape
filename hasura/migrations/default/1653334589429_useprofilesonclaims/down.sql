
alter table "public"."claims" add column "user_id" int8;
alter table "public"."claims" alter column "user_id" drop not null;
alter table "public"."claims"
  add constraint "claims_user_id_fkey"
  foreign key (user_id)
  references "public"."users"
  (id) on update no action on delete no action;

alter table "public"."claims" drop column "profile_id";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "profile_id" bigint
--  not null;
