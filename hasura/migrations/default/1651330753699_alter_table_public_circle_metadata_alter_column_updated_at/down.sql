alter table "public"."circle_metadata" alter column "updated_at" drop not null;
ALTER TABLE "public"."circle_metadata" ALTER COLUMN "updated_at" drop default;
