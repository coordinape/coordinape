CREATE TABLE
  "public"."virtual_profiles_similarity" (
    "id" bigserial NOT NULL,
    "similarity" double precision NOT NULL,
    PRIMARY KEY ("id")
  );

COMMENT ON TABLE "public"."virtual_profiles_similarity" IS E'Virtual table for profiles vector similarity';

CREATE OR REPLACE FUNCTION "public".similar_profiles(
  match_threshold float,
  profile_address text,
  limit_count INT)
RETURNS SETOF public.virtual_profiles_similarity
LANGUAGE plpgsql
AS $$

DECLARE
  target_vector vector(1536);
BEGIN
  -- Retrieve the target_vector for the given profile
  SELECT description_embedding INTO target_vector
  FROM public.profiles
  WHERE LOWER(address) = LOWER(profile_address);

  -- Return empty array if no vector found for address
  IF target_vector IS NULL THEN
    RETURN;
  END IF;

  -- Execute the main query using the retrieved target_vector
  RETURN QUERY
  SELECT
    id,
    (description_embedding <#> target_vector) * -1 AS similarity
  FROM
    public.profiles
  WHERE
    LOWER(address) != LOWER(profile_address) AND -- Exclude the profile itself from the results
    (description_embedding <#> target_vector) * -1 > match_threshold
  ORDER BY
    similarity DESC
  LIMIT
    limit_count;
END;
$$ STABLE;

-- not used right now, but useful for arbitrary vector search in the future
CREATE OR REPLACE FUNCTION "public".vector_similar_profiles_by_description_embedding(
  target_vector vector(1536),
  match_threshold float,
  limit_count INT)
RETURNS SETOF public.virtual_profiles_similarity
LANGUAGE plpgsql
AS $$

#variable_conflict use_variable
BEGIN
  RETURN QUERY
  SELECT
    id,
    (description_embedding <#> target_vector) * -1 AS similarity
  FROM
    public.profiles
  WHERE
    -- The dot product is negative because of a Postgres limitation, so we negate it
    (description_embedding <#> target_vector) * -1 > match_threshold
  ORDER BY
    similarity DESC
  LIMIT
    limit_count;
END;
$$ STABLE;
