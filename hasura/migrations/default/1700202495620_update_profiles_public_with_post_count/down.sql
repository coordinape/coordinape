CREATE OR REPLACE VIEW "public"."profiles_public" AS
 SELECT p.id,
    p.address,
    p.name,
    p.avatar
   FROM profiles p;
