CREATE INDEX IF NOT EXISTS idx_replies_reply_gin ON "replies" USING gin ((reply) gin_trgm_ops);

CREATE OR REPLACE FUNCTION search_replies(
    search TEXT
) 
RETURNS SETOF replies 
AS $$
    SELECT * 
    FROM replies 
    WHERE search <% reply
    ORDER BY similarity(search, reply) DESC 
$$ 
LANGUAGE sql STABLE;
