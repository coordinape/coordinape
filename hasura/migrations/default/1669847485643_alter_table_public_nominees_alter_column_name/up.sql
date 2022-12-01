ALTER TABLE "public"."nominees" ALTER COLUMN "name" TYPE citext;
alter table "public"."nominees" add constraint "nominees_name_key" unique ("name");
