alter table "public"."nominees" drop constraint "nominees_name_key";
ALTER TABLE "public"."nominees" ALTER COLUMN "name" TYPE character varying;
