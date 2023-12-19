CREATE OR REPLACE FUNCTION update_profile_links_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT and UPDATE operations
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.holder < NEW.target THEN
            -- Update holder first, then target
            UPDATE profiles
            SET links_held = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE holder ILIKE NEW.holder
            )
            WHERE address ILIKE NEW.holder;

            UPDATE profiles
            SET links = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE target ILIKE NEW.target
            )
            WHERE address ILIKE NEW.target;
        ELSE
            -- Update target first, then holder
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
        END IF;

    -- Handle DELETE operation
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.holder < OLD.target THEN
            -- Update holder first, then target
            UPDATE profiles
            SET links_held = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE holder ILIKE OLD.holder
            )
            WHERE address ILIKE OLD.holder;

            UPDATE profiles
            SET links = (
                SELECT COALESCE(SUM(amount), 0)
                FROM link_holders
                WHERE target ILIKE OLD.target
            )
            WHERE address ILIKE OLD.target;
        ELSE
            -- Update target first, then holder
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
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
