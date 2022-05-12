CREATE OR REPLACE VIEW "public"."user_private" AS 
 SELECT us.id AS user_id,
    cr.fixed_payment_enabled,
    cr.fixed_payment_token_type,
    us.fixed_payment_amount
   FROM users us
   LEFT JOIN circles cr ON cr.id = us.circle_id;
