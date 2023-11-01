-- We dot product for distances
-- OpenAI embeddings are normalized to length 1, so
-- cosine similarity and dot product will produce the same results.
-- Using dot product which can be computed slightly faster.
--
-- For the different syntaxes, see https://github.com/pgvector/pgvector
CREATE OR REPLACE FUNCTION "public".vector_search_poap_events(target_vector vector(1536), match_threshold float, limit_count INT)
RETURNS SETOF public.poap_events 
LANGUAGE plpgsql
AS $$

#variable_conflict use_variable
BEGIN
  RETURN QUERY
  SELECT
    id, created_at, updated_at, fancy_id, name, event_url, image_url, country, city, description, 
    year, start_date, end_date, expiry_date, supply, poap_id, embedding,
    (embedding <#> target_vector) * -1 AS similarity
  FROM
    public.poap_events
  WHERE
    -- The dot product is negative because of a Postgres limitation, so we negate it
    (embedding <#> target_vector) * -1 > match_threshold
  ORDER BY
    similarity DESC
  LIMIT
    limit_count;
END;
$$ STABLE;

CREATE OR REPLACE FUNCTION "public".vector_search_poap_holders(target_vector vector(1536), match_threshold float, limit_count INT)
RETURNS SETOF public.poap_holders 
LANGUAGE plpgsql
AS $$

#variable_conflict use_variable
BEGIN
  RETURN QUERY
  SELECT
    ph.*
  FROM
    public.poap_holders ph
  JOIN
    (
      SELECT
        pe.poap_id,
        (pe.embedding <#> target_vector) * -1 AS similarity
      FROM
        public.poap_events pe
      WHERE
        -- The dot product is negative because of a Postgres limitation, so we negate it
        (pe.embedding <#> target_vector) * -1 > match_threshold
      ORDER BY
        similarity DESC
      LIMIT
        limit_count
    ) AS closest_poap_events
  ON
    ph.event_id = closest_poap_events.poap_id
  ORDER BY
    closest_poap_events.similarity ASC,
    ph.address DESC, ph.id DESC;  -- Adjust the ORDER BY clause based on how you define "first" for each address
END;
$$ STABLE;
