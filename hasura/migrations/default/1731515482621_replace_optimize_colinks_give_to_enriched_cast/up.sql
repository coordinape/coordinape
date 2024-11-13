-- Create the colinks_gives trigger function
CREATE OR REPLACE FUNCTION colinks_give_to_enriched_cast()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if there's a cast_hash
    IF NEW.cast_hash IS NOT NULL THEN
        BEGIN
            -- Get the cast and call the enriched cast function
            PERFORM insert_into_enriched_casts(c.*)
            FROM farcaster.casts c
            -- Convert NEW.cast_hash from hex string to bytea and compare with c.hash
            WHERE c.hash = decode(substring(NEW.cast_hash from 3), 'hex');
        EXCEPTION WHEN OTHERS THEN
            -- Log error but don't fail the transaction
            RAISE NOTICE 'Failed to process enriched cast for colinks_gives ID: %, cast_hash: %. Error: %',
                NEW.id, NEW.cast_hash, SQLERRM;
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
