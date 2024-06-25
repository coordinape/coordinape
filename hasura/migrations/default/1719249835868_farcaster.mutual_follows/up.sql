CREATE OR REPLACE VIEW farcaster.mutual_follows AS
SELECT l1.fid, l1.target_fid, l1."timestamp" AS link_timestamp
FROM farcaster.links l1
WHERE l1.deleted_at IS NULL
  AND l1.type = 'follow'
  AND EXISTS (
    SELECT 1
    FROM farcaster.links l2
    WHERE l2.fid = l1.target_fid
      AND l2.target_fid = l1.fid
      AND l2.deleted_at IS NULL
      AND l2.type = 'follow'
  )
ORDER BY l1."timestamp" DESC;
