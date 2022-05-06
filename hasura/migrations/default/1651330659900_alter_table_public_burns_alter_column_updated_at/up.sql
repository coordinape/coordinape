alter table "public"."burns" alter column "updated_at" set default now();
alter table "public"."burns" alter column "updated_at" set not null;
