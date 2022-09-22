ALTER TABLE IF EXISTS "public"."organizations" RENAME TO "protocols";
ALTER INDEX IF EXISTS organizations_pkey RENAME TO protocols_pkey;
ALTER TRIGGER set_public_organizations_updated_at ON public.protocols RENAME TO set_public_protocols_updated_at;
ALTER SEQUENCE IF EXISTS public.organizations_id_seq RENAME TO protocols_id_seq;
ALTER TABLE IF EXISTS public.circles RENAME CONSTRAINT circles_organization_id_fkey TO circles_protocol_id_fkey;
ALTER TABLE IF EXISTS public.circles RENAME organization_id TO protocol_id;
