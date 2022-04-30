alter table "public"."circle_metadata" alter column "updated_at" set default now();
alter table "public"."circle_metadata" alter column "updated_at" set not null;
