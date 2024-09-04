CREATE OR REPLACE FUNCTION insert_into_enriched_casts()
RETURNS TRIGGER AS $$
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
        NEW.id,
        NEW.created_at,
        NEW.updated_at,
        NEW.deleted_at,
        NEW.timestamp,
        NEW.fid,
        NEW.hash,
        NEW.parent_hash,
        NEW.parent_fid,
        NEW.parent_url,
        NEW.text,
        NEW.embeds,
        NEW.mentions,
        NEW.mentions_positions,
        NEW.root_parent_hash,
        NEW.root_parent_url,
        fa.profile_id
    FROM public.farcaster_accounts fa
    WHERE fa.fid = NEW.fid AND NEW.deleted_at IS NULL AND NEW.parent_hash IS NULL
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS insert_enriched_casts_trigger ON farcaster.casts;
CREATE TRIGGER insert_enriched_casts_trigger
AFTER INSERT ON farcaster.casts
FOR EACH ROW
EXECUTE FUNCTION insert_into_enriched_casts();
