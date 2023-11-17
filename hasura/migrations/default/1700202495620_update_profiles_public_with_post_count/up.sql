CREATE OR REPLACE VIEW "public"."profiles_public" AS 
 SELECT p.id,
    p.address,
    p.name,
    p.avatar,
    count(c.*) AS post_count,
    COUNT(CASE WHEN c.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS post_count_last_30_days
   FROM (profiles p
     LEFT JOIN contributions c ON (((c.profile_id = p.id) AND (c.private_stream = true))))
  GROUP BY p.id, p.address, p.name, p.avatar;
