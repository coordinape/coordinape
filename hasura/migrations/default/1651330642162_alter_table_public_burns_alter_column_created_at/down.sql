alter table "public"."burns" alter column "created_at" drop not null;
ALTER TABLE "public"."burns" ALTER COLUMN "created_at" drop default;
