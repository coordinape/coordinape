CREATE OR REPLACE VIEW public.mutual_link_holders AS
SELECT lh1.holder, lh1.target
FROM link_holders lh1
WHERE EXISTS (
  SELECT 1
  FROM link_holders lh2
  WHERE lh2.holder = lh1.target
    AND lh2.target = lh1.holder
    AND lh1.holder != lh1.target
);
