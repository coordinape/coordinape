alter table "public"."circle_metadata" alter column "created_at" drop not null;
ALTER TABLE "public"."circle_metadata" ALTER COLUMN "created_at" drop default;
