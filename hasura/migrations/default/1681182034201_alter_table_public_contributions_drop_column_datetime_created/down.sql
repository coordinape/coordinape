alter table "public"."contributions" add column "datetime_created" timestamptz;
alter table "public"."contributions" alter column "datetime_created" set default now();
alter table "public"."contributions" alter column "datetime_created" drop not null;
