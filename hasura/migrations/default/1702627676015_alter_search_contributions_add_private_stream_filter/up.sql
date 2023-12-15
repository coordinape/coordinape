CREATE OR REPLACE FUNCTION search_contributions(
    search TEXT, 
    result_limit INT
) 
RETURNS SETOF contributions 
AS $$
    SELECT * 
    FROM contributions 
    WHERE private_stream=true AND search <% description
    ORDER BY similarity(search, description) DESC 
    LIMIT result_limit; 
$$ 
LANGUAGE sql STABLE;
