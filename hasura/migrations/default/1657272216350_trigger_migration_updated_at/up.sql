DO $$
BEGIN
    CREATE TRIGGER "set_circle_integrations_updated_at"
    BEFORE UPDATE ON "public"."circle_integrations"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_circle_integrations_updated_at" ON "public"."circle_integrations"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;