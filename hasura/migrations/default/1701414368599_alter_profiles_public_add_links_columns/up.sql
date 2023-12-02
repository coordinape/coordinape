CREATE OR REPLACE VIEW "public"."profiles_public" AS 
 SELECT p.id,
    p.address,
    p.name,
    p.avatar,
    p.description,
    count(c.*) AS post_count,
    count(
        CASE
            WHEN (c.created_at >= (CURRENT_DATE - '30 days'::interval)) THEN 1
            ELSE NULL::integer
        END) AS post_count_last_30_days,
    p.website,
    p.links,
    p.links_held
   FROM (profiles p
     LEFT JOIN contributions c ON (((c.profile_id = p.id) AND (c.private_stream = true))))
  GROUP BY p.id, p.address, p.name, p.avatar;
