-- profiles
DO $$
BEGIN
  CREATE TRIGGER "set_public_profiles_updated_at"
    BEFORE UPDATE ON "public"."profiles"
  FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_profiles_updated_at" ON "public"."profiles"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object
      THEN RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- distributions
DO $$
BEGIN
  CREATE TRIGGER "set_public_distributions_updated_at"
    BEFORE UPDATE ON "public"."distributions"
  FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_distributions_updated_at" ON "public"."distributions"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object
      THEN RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;
