CREATE
OR REPLACE VIEW "public"."profile_casts" AS
SELECT c.id as cast_id,fa.profile_id,fa.fid FROM "farcaster"."casts" c JOIN "public"."farcaster_accounts" fa ON fa.fid = c.fid WHERE c.deleted_at IS NULL;
