CREATE OR REPLACE FUNCTION public.most_reacted_casts(time_period interval, reaction_type smallint, result_limit integer)
 RETURNS SETOF virtual_reactions_count
 LANGUAGE sql
 STABLE
AS $function$
    SELECT
        reactions.target_hash,
        COUNT(*) AS likes_count
    FROM
        farcaster.reactions
    JOIN public.enriched_casts ec ON (ec.hash = reactions.target_hash AND ec.deleted_at IS NULL)    
    WHERE
        reactions.created_at >= NOW() - time_period
        AND reactions.reaction_type = reaction_type
        AND reactions.deleted_at IS NULL
    GROUP BY
        reactions.target_hash
    ORDER BY
        likes_count DESC, MAX(reactions.created_at) DESC
    LIMIT
        result_limit;
$function$;
