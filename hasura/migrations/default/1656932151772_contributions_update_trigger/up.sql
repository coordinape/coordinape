DO $$
BEGIN
    CREATE TRIGGER "set_public_contributions_updated_at"
    BEFORE UPDATE ON "public"."contributions"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_contributions_updated_at" ON "public"."contributions"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;
