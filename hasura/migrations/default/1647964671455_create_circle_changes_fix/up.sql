
alter table "public"."circles" alter column "created_at" drop not null;

alter table "public"."circles" alter column "updated_at" drop not null;

alter table "public"."protocols" alter column "created_at" drop not null;

alter table "public"."protocols" alter column "updated_at" drop not null;

alter table "public"."circles" add column if not exists "contact" text
    null;
