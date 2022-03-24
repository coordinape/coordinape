
alter table "public"."protocols" alter column "updated_at" set not null;

alter table "public"."protocols" alter column "created_at" set not null;

alter table "public"."circles" alter column "updated_at" set not null;

alter table "public"."circles" alter column "created_at" set not null;

alter table "public"."circles" drop column "contact";
