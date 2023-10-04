CREATE OR REPLACE VIEW "public"."contribution_count" AS 
 SELECT p.id AS profile_id,
    count(*) AS contributions
   FROM ((contributions c
     JOIN users u ON ((u.id = c.user_id)))
     JOIN profiles p ON (((p.id)::text = (u.profile_id)::text))
     JOIN circles ci ON ((ci.id = c.circle_id))
     JOIN organizations o ON ((o.id = ci.organization_id)))
  WHERE (o.sample = false)
  GROUP BY p.id;
