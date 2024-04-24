CREATE
OR REPLACE VIEW "public"."colinks_gives_skill_count" AS
SELECT
  colinks_gives.skill,
  colinks_gives.target_profile_id,
  count(*) AS gives,
  count(*) FILTER (
    WHERE
      (
        colinks_gives.created_at >= (CURRENT_TIMESTAMP - '24:00:00' :: interval)
      )
  ) AS gives_last_24_hours,
  count(*) FILTER (
    WHERE
      (
        colinks_gives.created_at >= (CURRENT_DATE - '7 days' :: interval)
      )
  ) AS gives_last_7_days,
  count(*) FILTER (
    WHERE
      (
        colinks_gives.created_at >= (CURRENT_DATE - '30 days' :: interval)
      )
  ) AS gives_last_30_days
FROM
  colinks_gives
GROUP BY
  colinks_gives.skill,
  colinks_gives.target_profile_id;
