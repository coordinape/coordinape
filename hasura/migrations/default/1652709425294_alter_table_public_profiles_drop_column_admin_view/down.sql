alter table "public"."profiles" alter column "admin_view" set default false;
alter table "public"."profiles" alter column "admin_view" drop not null;
alter table "public"."profiles" add column "admin_view" bool;
