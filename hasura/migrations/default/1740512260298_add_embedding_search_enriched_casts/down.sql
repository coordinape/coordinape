-- Drop the function
DROP FUNCTION IF EXISTS "public".vector_search_enriched_casts(vector(1024), float, INT, timestamp);

-- Drop the virtual table
DROP TABLE IF EXISTS "public"."virtual_enriched_casts_similarity";

-- Drop the indices
DROP INDEX IF EXISTS public.idx_enriched_casts_embedding;
DROP INDEX IF EXISTS public.idx_enriched_casts_created_at;
