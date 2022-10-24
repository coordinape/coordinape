ALTER TABLE IF EXISTS "public"."members" RENAME TO "users";

ALTER INDEX IF EXISTS public.members_pkey RENAME TO users_pkey;
ALTER INDEX IF EXISTS public.members_circle_id_idx RENAME TO users_circle_id_idx;

ALTER TRIGGER set_public_members_updated_at ON public.users RENAME TO set_public_users_updated_at;

ALTER SEQUENCE IF EXISTS public.members_id_seq RENAME TO users_id_seq;

ALTER TRIGGER members_insert_trigger ON public.users
    RENAME TO users_insert_trigger;

ALTER TABLE IF EXISTS public.users
    RENAME CONSTRAINT members_address_circle_id_deleted_at_key TO users_address_circle_id_deleted_at_key;
ALTER TABLE IF EXISTS public.users
    RENAME CONSTRAINT members_address_fkey TO users_address_fkey;
ALTER TABLE IF EXISTS public.users
    RENAME CONSTRAINT members_circle_id_foreign TO users_circle_id_foreign;

ALTER TABLE IF EXISTS public.burns
    RENAME member_id TO user_id;
ALTER INDEX IF EXISTS public.burns_member_id_idx
    RENAME TO burns_user_id_idx;
ALTER TABLE IF EXISTS public.burns
    RENAME CONSTRAINT burns_member_id_foreign TO burns_user_id_foreign;

ALTER TABLE IF EXISTS public.teammates
    RENAME member_id TO user_id;
ALTER TABLE public.teammates
    RENAME CONSTRAINT teammates_member_id_team_mate_id_key TO teammates_user_id_team_mate_id_key;

ALTER TABLE IF EXISTS public.contributions
    RENAME member_id TO user_id;
ALTER TABLE IF EXISTS public.contributions
    RENAME CONSTRAINT contributions_member_id_fkey TO contributions_user_id_fkey;

ALTER TABLE IF EXISTS public.histories
    RENAME member_id TO user_id;
ALTER TABLE IF EXISTS public.nominees
    RENAME member_id TO user_id;
ALTER TABLE IF EXISTS public.nominees
    RENAME nominated_by_member_id TO nominated_by_user_id;

DROP VIEW IF EXISTS public.member_private;
CREATE OR REPLACE VIEW public.user_private
    AS
     SELECT us.id AS user_id,
    cr.fixed_payment_token_type,
    us.fixed_payment_amount,
    us.circle_id
   FROM users us
     LEFT JOIN circles cr ON cr.id = us.circle_id;
