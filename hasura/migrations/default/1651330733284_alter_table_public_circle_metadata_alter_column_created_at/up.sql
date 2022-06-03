alter table "public"."circle_metadata" alter column "created_at" set default now();
alter table "public"."circle_metadata" alter column "created_at" set not null;
