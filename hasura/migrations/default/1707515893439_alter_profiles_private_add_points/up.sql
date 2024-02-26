CREATE OR REPLACE VIEW "public"."profiles_private" AS 
 SELECT p.id,
    p.address,
    p.device_login_token,
    p.points_checkpointed_at,
    p.points_balance
   FROM profiles p;
