-- We dot product for distances
-- OpenAI embeddings are normalized to length 1, so
-- cosine similarity and dot product will produce the same results.
-- Using dot product which can be computed slightly faster.
--
-- For the different syntaxes, see https://github.com/pgvector/pgvector

-- Create indices for vector search and timestamp filtering
CREATE INDEX IF NOT EXISTS idx_enriched_casts_embedding ON public.enriched_casts USING ivfflat (embedding vector_ip_ops);
CREATE INDEX IF NOT EXISTS idx_enriched_casts_created_at ON public.enriched_casts USING btree (created_at);

-- Create virtual table for enriched casts similarity results
CREATE TABLE "public"."virtual_enriched_casts_similarity" (
    "id" bigint NOT NULL,
    "similarity" double precision NOT NULL,
    PRIMARY KEY ("id")
);

COMMENT ON TABLE "public"."virtual_enriched_casts_similarity" IS E'Virtual table for enriched casts vector similarity';

CREATE OR REPLACE FUNCTION "public".vector_search_enriched_casts(
    target_vector vector(1024), 
    match_threshold float, 
    limit_count INT,
    created_after timestamp DEFAULT NULL
)
RETURNS SETOF public.virtual_enriched_casts_similarity
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ec.id,
    (ec.embedding <#> target_vector) * -1 AS similarity
  FROM
    public.enriched_casts ec
  WHERE
    -- The dot product is negative because of a Postgres limitation, so we negate it
    (ec.embedding <#> target_vector) * -1 > match_threshold
    AND ec.deleted_at IS NULL  -- Only include non-deleted casts
    AND ec.embedding IS NOT NULL  -- Only include casts with embeddings
    -- Filter by creation date if specified
    AND (created_after IS NULL OR ec.created_at > created_after)
  ORDER BY
    similarity DESC
  LIMIT
    limit_count;
END;
$$;
