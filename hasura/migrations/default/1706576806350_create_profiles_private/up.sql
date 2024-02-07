CREATE OR REPLACE VIEW "public"."profiles_private" AS 
 SELECT p.id,
    p.address,
    p.device_login_token
   FROM profiles p;
