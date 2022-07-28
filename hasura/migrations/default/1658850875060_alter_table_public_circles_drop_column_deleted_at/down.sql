alter table "public"."circles" alter column "deleted_at" drop not null;
alter table "public"."circles" add column "deleted_at" time;
