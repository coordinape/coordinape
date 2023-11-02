DROP FUNCTION IF EXISTS "public".vector_search_poap_events(target_vector vector(1536), match_threshold float, limit_count INT);
DROP FUNCTION IF EXISTS "public".vector_search_poap_holders(target_vector vector(1536), match_threshold float, limit_count INT);
DROP FUNCTION IF EXISTS public.similar_poap_events(input_poap_id INT, limit_count INT);

