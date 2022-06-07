alter table "public"."claims" alter column "claimed" set default false;
alter table "public"."claims" alter column "claimed" drop not null;
alter table "public"."claims" add column "claimed" bool;
