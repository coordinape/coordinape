CREATE EXTENSION pg_trgm;

CREATE INDEX idx_contributions_description_gin ON "contributions" USING gin ((description) gin_trgm_ops);



CREATE FUNCTION search_contributions(
    search TEXT, 
    result_limit INT
) 
RETURNS SETOF contributions 
AS $$
    SELECT * 
    FROM contributions 
    WHERE search <% description 
    ORDER BY similarity(search, description) DESC 
    LIMIT result_limit; 
$$ 
LANGUAGE sql STABLE;
