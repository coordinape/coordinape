-- Define the trigger function
    CREATE OR REPLACE FUNCTION update_profile_links_trigger()
    RETURNS TRIGGER AS $$
    BEGIN
        -- Handle INSERT and UPDATE operations
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            UPDATE profiles
            SET links = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE target ILIKE NEW.target
            )
            WHERE address ILIKE NEW.target;

            UPDATE profiles
            SET links_held = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE holder ILIKE NEW.holder
            )
            WHERE address ILIKE NEW.holder;

        -- Handle DELETE operation
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE profiles
            SET links = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE target ILIKE OLD.target
            )
            WHERE address ILIKE OLD.target;

            UPDATE profiles
            SET links_held = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE holder ILIKE OLD.holder
            )
            WHERE address ILIKE OLD.holder;
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create the trigger
    CREATE TRIGGER link_holders_update_trigger
    AFTER INSERT OR DELETE OR UPDATE ON link_holders
    FOR EACH ROW EXECUTE FUNCTION update_profile_links_trigger();
