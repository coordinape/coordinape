CREATE OR REPLACE FUNCTION function_ensure_profile_exists() RETURNS TRIGGER AS
$BODY$
  BEGIN
      INSERT INTO "profiles"(address) VALUES(new.address) ON CONFLICT DO NOTHING;
      RETURN new;
  END;
$BODY$
language plpgsql;

DO $$
BEGIN
    CREATE TRIGGER users_insert_trigger BEFORE INSERT OR UPDATE on "users" FOR EACH ROW EXECUTE PROCEDURE function_ensure_profile_exists();
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger already exists. Ignoring...';
END$$;
