alter table "public"."burns" alter column "updated_at" drop not null;
ALTER TABLE "public"."burns" ALTER COLUMN "updated_at" drop default;
