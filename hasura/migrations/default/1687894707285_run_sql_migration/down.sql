CREATE OR REPLACE VIEW "public"."contribution_count" AS 
 SELECT p.id AS profile_id,
    count(*) AS contributions
   FROM ((contributions c
     JOIN users u ON ((u.id = c.user_id)))
     JOIN profiles p ON (((p.address)::text = (u.address)::text)))
  GROUP BY p.id;
