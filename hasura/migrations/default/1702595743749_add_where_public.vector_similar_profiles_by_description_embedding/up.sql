DROP FUNCTION IF EXISTS public.vector_similar_profiles_by_description_embedding;
CREATE OR REPLACE FUNCTION public.vector_similar_profiles_by_description_embedding(
    target_vector vector,
    match_threshold double precision,
    limit_count integer,
    additional_where text DEFAULT NULL
)
RETURNS SETOF virtual_profiles_similarity
LANGUAGE plpgsql
STABLE
AS $function$

BEGIN
    RETURN QUERY EXECUTE 
        'SELECT id, (description_embedding <#> $1) * -1 AS similarity ' ||
        'FROM public.profiles ' ||
        'WHERE (description_embedding <#> $1) * -1 > $2 ' ||
        (CASE WHEN additional_where IS NOT NULL THEN ' AND ' || additional_where ELSE '' END) ||
        ' ORDER BY similarity DESC ' ||
        'LIMIT $3'
    USING target_vector, match_threshold, limit_count;
END;
$function$;
