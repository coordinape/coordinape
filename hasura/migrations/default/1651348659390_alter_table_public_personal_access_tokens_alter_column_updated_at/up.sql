alter table "public"."personal_access_tokens" alter column "updated_at" set default now();
alter table "public"."personal_access_tokens" alter column "updated_at" set not null;
