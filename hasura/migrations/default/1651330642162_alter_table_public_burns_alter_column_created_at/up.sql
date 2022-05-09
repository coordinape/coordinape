alter table "public"."burns" alter column "created_at" set default now();
alter table "public"."burns" alter column "created_at" set not null;
