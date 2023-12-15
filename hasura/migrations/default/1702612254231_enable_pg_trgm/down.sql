DROP FUNCTION IF EXISTS search_contributions(TEXT, INT);
DROP INDEX IF EXISTS idx_contributions_description_gin;
DROP EXTENSION IF EXISTS pg_trgm;
