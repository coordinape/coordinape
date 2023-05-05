CREATE OR REPLACE VIEW "public"."note_count" AS 
 SELECT p.id AS profile_id,
    count(*) AS notes
   FROM ((token_gifts t
     JOIN users u ON ((u.id = t.recipient_id)))
     JOIN profiles p ON (((p.address)::text = (u.address)::text)))
  WHERE (t.note <> ''::text)
  GROUP BY p.id;
