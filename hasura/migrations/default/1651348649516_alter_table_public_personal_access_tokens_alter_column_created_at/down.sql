alter table "public"."personal_access_tokens" alter column "created_at" drop not null;
ALTER TABLE "public"."personal_access_tokens" ALTER COLUMN "created_at" drop default;
