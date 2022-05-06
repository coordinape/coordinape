alter table "public"."personal_access_tokens" alter column "created_at" set default now();
alter table "public"."personal_access_tokens" alter column "created_at" set not null;
