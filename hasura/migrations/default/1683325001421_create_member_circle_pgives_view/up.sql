CREATE OR REPLACE VIEW "public"."member_circle_pgives" AS 
 SELECT member_epoch_pgives.user_id,
    member_epoch_pgives.circle_id,
    sum(member_epoch_pgives.normalized_pgive) AS pgive,
    count(*) AS epochs
   FROM member_epoch_pgives
  GROUP BY member_epoch_pgives.user_id, member_epoch_pgives.circle_id;
