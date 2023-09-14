alter table "public"."users"
add column "profile_id" bigint;
UPDATE "public"."users"
SET profile_id = profiles.id
FROM "public"."profiles"
WHERE "public"."users".address = profiles.address;

