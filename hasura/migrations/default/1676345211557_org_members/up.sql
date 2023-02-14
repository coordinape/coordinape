CREATE TABLE public.org_members (
    id BIGSERIAL PRIMARY KEY,
    profile_id bigint NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    org_id bigint NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    deleted_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone,
    role integer NOT NULL DEFAULT 0,
    CONSTRAINT org_members_profile_id_org_id_key UNIQUE (profile_id, org_id)
);
