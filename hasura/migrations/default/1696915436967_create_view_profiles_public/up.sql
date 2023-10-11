CREATE
OR REPLACE VIEW "public"."profiles_public" AS
SELECT
  p.id AS id,
  p.address AS address,
  p.name AS name,
  p.avatar AS avatar
FROM    profiles p;
