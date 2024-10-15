-- Down migration: Drop the function created in the up migration
DROP FUNCTION IF EXISTS public.most_reacted_casts(interval, smallint, integer);
