-- burns
DO $$
BEGIN
    CREATE TRIGGER "set_public_burns_updated_at"
    BEFORE UPDATE ON "public"."burns"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_burns_updated_at" ON "public"."burns"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- circle_metadata
DO $$
BEGIN
    CREATE TRIGGER "set_public_circle_metadata_updated_at"
    BEFORE UPDATE ON "public"."circle_metadata"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_circle_metadata_updated_at" ON "public"."circle_metadata"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- circles
DO $$
BEGIN
    CREATE TRIGGER "set_public_circles_updated_at"
    BEFORE UPDATE ON "public"."circles"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_circles_updated_at" ON "public"."circles"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- epoches
DO $$
BEGIN
    CREATE TRIGGER "set_public_epoches_updated_at"
    BEFORE UPDATE ON "public"."epoches"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_epoches_updated_at" ON "public"."epoches"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- histories
DO $$
BEGIN
    CREATE TRIGGER "set_public_histories_updated_at"
    BEFORE UPDATE ON "public"."histories"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_histories_updated_at" ON "public"."histories"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- nominees
DO $$
BEGIN
    CREATE TRIGGER "set_public_nominees_updated_at"
    BEFORE UPDATE ON "public"."nominees"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_nominees_updated_at" ON "public"."nominees"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- pending_token_gifts
DO $$
BEGIN
    CREATE TRIGGER "set_public_pending_token_gifts_updated_at"
    BEFORE UPDATE ON "public"."pending_token_gifts"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_pending_token_gifts_updated_at" ON "public"."pending_token_gifts"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- personal_access_tokens
DO $$
BEGIN
    CREATE TRIGGER "set_public_personal_access_tokens_updated_at"
    BEFORE UPDATE ON "public"."personal_access_tokens"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_personal_access_tokens_updated_at" ON "public"."personal_access_tokens"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- protocols
DO $$
BEGIN
    CREATE TRIGGER "set_public_protocols_updated_at"
    BEFORE UPDATE ON "public"."protocols"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_protocols_updated_at" ON "public"."protocols"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- teammates
DO $$
BEGIN
    CREATE TRIGGER "set_public_teammates_updated_at"
    BEFORE UPDATE ON "public"."teammates"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_teammates_updated_at" ON "public"."teammates"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- token_gifts
DO $$
BEGIN
    CREATE TRIGGER "set_public_token_gifts_updated_at"
    BEFORE UPDATE ON "public"."token_gifts"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_token_gifts_updated_at" ON "public"."token_gifts"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- users
DO $$
BEGIN
    CREATE TRIGGER "set_public_users_updated_at"
    BEFORE UPDATE ON "public"."users"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_users_updated_at" ON "public"."users"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- vouches
DO $$
BEGIN
    CREATE TRIGGER "set_public_vouches_updated_at"
    BEFORE UPDATE ON "public"."vouches"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_vouches_updated_at" ON "public"."vouches"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;
