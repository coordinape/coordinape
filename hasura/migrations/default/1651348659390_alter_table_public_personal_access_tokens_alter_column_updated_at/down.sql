alter table "public"."personal_access_tokens" alter column "updated_at" drop not null;
ALTER TABLE "public"."personal_access_tokens" ALTER COLUMN "updated_at" drop default;
