ALTER TABLE IF EXISTS "public"."protocols" RENAME TO "organizations";
ALTER INDEX IF EXISTS protocols_pkey RENAME TO organizations_pkey;
ALTER TRIGGER set_public_protocols_updated_at ON public.organizations RENAME TO set_public_organizations_updated_at;
ALTER SEQUENCE IF EXISTS public.protocols_id_seq RENAME TO organizations_id_seq;
ALTER TABLE IF EXISTS public.circles RENAME CONSTRAINT circles_protocol_id_fkey TO circles_organization_id_fkey;
ALTER TABLE IF EXISTS public.circles RENAME protocol_id TO organization_id;
