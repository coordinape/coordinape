alter table "public"."users"
add column "profile_id" bigint null;
UPDATE "public"."users"
SET profile_id = profiles.id
FROM "public"."profiles"
WHERE lower("public"."users".address) = lower(profiles.address);
alter table "public"."users" alter column "profile_id" set not null;
alter table "public"."users"
add constraint "users_profile_id_circle_id_deleted_at_key" unique ("profile_id", "circle_id", "deleted_at");
alter table "public"."users"
add constraint "users_profile_id_fkey" foreign key ("profile_id") references "public"."profiles" ("id") on update restrict on delete restrict;
alter table "public"."users" drop constraint "users_address_fkey";
alter table "public"."users" drop constraint "users_address_circle_id_deleted_at_key";
DROP INDEX IF EXISTS "public"."users_address_circle_id_deleted_at_key";
alter table "public"."users" drop column "address" cascade;
