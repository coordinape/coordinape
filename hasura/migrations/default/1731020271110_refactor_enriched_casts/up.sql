-- First drop the functions (order matters due to dependencies)
DROP FUNCTION IF EXISTS insert_into_enriched_casts() CASCADE;
DROP FUNCTION IF EXISTS colinks_give_to_enriched_cast() CASCADE;
DROP FUNCTION IF EXISTS cast_to_enriched_cast() CASCADE;
-- Drop new trigger if it exists
DROP TRIGGER IF EXISTS insert_enriched_casts_from_colinks_gives_trigger ON public.colinks_gives;
DROP TRIGGER IF EXISTS insert_enriched_casts_trigger ON farcaster.casts;

-- Create the core function with the desired name
CREATE OR REPLACE FUNCTION insert_into_enriched_casts(
    _record farcaster.casts
) RETURNS void AS $$
BEGIN
    INSERT INTO public.enriched_casts (
        id,
        created_at,
        updated_at,
        deleted_at,
        timestamp,
        fid,
        hash,
        parent_hash,
        parent_fid,
        parent_url,
        text,
        embeds,
        mentions,
        mentions_positions,
        root_parent_hash,
        root_parent_url,
        profile_id
    )
    SELECT
        _record.id,
        _record.created_at,
        _record.updated_at,
        _record.deleted_at,
        _record.timestamp,
        _record.fid,
        _record.hash,
        _record.parent_hash,
        _record.parent_fid,
        _record.parent_url,
        _record.text,
        _record.embeds,
        _record.mentions,
        _record.mentions_positions,
        _record.root_parent_hash,
        _record.root_parent_url,
        fa.profile_id
    FROM public.farcaster_accounts fa
    WHERE fa.fid = _record.fid
    AND _record.deleted_at IS NULL
    AND _record.parent_hash IS NULL
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger function with the new name
CREATE OR REPLACE FUNCTION cast_to_enriched_cast()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM insert_into_enriched_casts(NEW);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
--             THIS JOIN WONT WORK BECAUSE OF TEXT!=ByteA
            WHERE c.hash = NEW.cast_hash;
        EXCEPTION WHEN OTHERS THEN
            -- Log error but don't fail the transaction
            RAISE NOTICE 'Failed to process enriched cast for colinks_gives ID: %, cast_hash: %. Error: %',
                NEW.id, NEW.cast_hash, SQLERRM;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the triggers
CREATE TRIGGER insert_enriched_casts_trigger
    AFTER INSERT ON farcaster.casts
    FOR EACH ROW
    EXECUTE FUNCTION cast_to_enriched_cast();


-- Create the new trigger
CREATE TRIGGER insert_enriched_casts_from_colinks_gives_trigger
    AFTER INSERT ON public.colinks_gives
    FOR EACH ROW
    EXECUTE FUNCTION colinks_give_to_enriched_cast();