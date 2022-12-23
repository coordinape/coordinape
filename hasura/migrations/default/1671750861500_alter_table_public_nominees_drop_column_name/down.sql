alter table "public"."nominees" alter column "name" drop not null;
alter table "public"."nominees" add column "name" varchar;
