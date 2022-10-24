ALTER TABLE IF EXISTS "public"."users" RENAME TO "members";

ALTER INDEX IF EXISTS public.users_pkey RENAME TO members_pkey;
ALTER INDEX IF EXISTS public.users_circle_id_idx RENAME TO members_circle_id_idx;

ALTER TRIGGER set_public_users_updated_at ON public.members RENAME TO set_public_members_updated_at;

ALTER SEQUENCE IF EXISTS public.users_id_seq RENAME TO members_id_seq;

ALTER TRIGGER users_insert_trigger ON public.members
    RENAME TO members_insert_trigger;

ALTER TABLE IF EXISTS public.members
    RENAME CONSTRAINT users_address_circle_id_deleted_at_key TO members_address_circle_id_deleted_at_key;
ALTER TABLE IF EXISTS public.members
    RENAME CONSTRAINT users_address_fkey TO members_address_fkey;
ALTER TABLE IF EXISTS public.members
    RENAME CONSTRAINT users_circle_id_foreign TO members_circle_id_foreign;

ALTER TABLE IF EXISTS public.burns
    RENAME user_id TO member_id;
ALTER INDEX IF EXISTS public.burns_user_id_idx
    RENAME TO burns_member_id_idx;
ALTER TABLE IF EXISTS public.burns
    RENAME CONSTRAINT burns_user_id_foreign TO burns_member_id_foreign;

ALTER TABLE IF EXISTS public.teammates
    RENAME user_id TO member_id;
ALTER TABLE public.teammates
    RENAME CONSTRAINT teammates_user_id_team_mate_id_key TO teammates_member_id_team_mate_id_key;

ALTER TABLE IF EXISTS public.contributions
    RENAME user_id TO member_id;
ALTER TABLE IF EXISTS public.contributions
    RENAME CONSTRAINT contributions_user_id_fkey TO contributions_member_id_fkey;


ALTER TABLE IF EXISTS public.histories
    RENAME user_id TO member_id;
ALTER TABLE IF EXISTS public.nominees
    RENAME user_id TO member_id;
ALTER TABLE IF EXISTS public.nominees
    RENAME nominated_by_user_id TO nominated_by_member_id;

-- ALTER TABLE public.user_private
--     OWNER TO postgres;

DROP VIEW public.user_private;
CREATE OR REPLACE VIEW public.member_private
    AS
     SELECT us.id AS member_id,
    cr.fixed_payment_token_type,
    us.fixed_payment_amount,
    us.circle_id
   FROM members us
     LEFT JOIN circles cr ON cr.id = us.circle_id;
