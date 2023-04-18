
drop trigger set_public_org_members_updated_at on public.org_members;
ALTER TABLE "public"."reactions" DROP CONSTRAINT "reactions_profile_id_activity_id_reaction_key";
DROP INDEX IF EXISTS "public"."reactions_index_profile_id";
DROP INDEX IF EXISTS "public"."reactions_index_activity_id";
DROP TABLE "public"."reactions";

CREATE  INDEX "activities_index_created_at" on
  "public"."activities" using btree ("created_at");

CREATE OR REPLACE FUNCTION function_ensure_profile_exists() RETURNS TRIGGER AS
$BODY$
  BEGIN
      INSERT INTO "profiles"(address, name) VALUES(new.address, new.name) ON CONFLICT DO NOTHING;
      RETURN new;
  END;
$BODY$
language plpgsql;

DO $$
BEGIN
    CREATE TRIGGER users_insert_trigger BEFORE INSERT OR UPDATE on "users" FOR EACH ROW EXECUTE PROCEDURE function_ensure_profile_exists();
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger already exists. Ignoring...';
END$$;

comment on column "public"."users"."name" is E'Members of a circle';
alter table "public"."users" alter column "name" drop not null;
alter table "public"."users" add column "name" varchar;

DROP TRIGGER IF EXISTS users_insert_trigger on "users";
DROP FUNCTION IF EXISTS function_ensure_profile_exists();
alter table "public"."epoches" drop column "created_by";

alter table "public"."profiles" alter column "name" drop not null;

alter table "public"."circle_api_keys" drop column "manage_users";

alter table "discord"."roles_circles" drop column "alerts";

drop table public.org_members;
BEGIN;
-- Convert epoch repeat data from one format to another.

-- For all "weekly" repeating epoches, these are represented as "repeat: 1" in the old schema. In the new schema, these are represented as "
-- {
--  "frequency": 1,
--  "frequency_unit": "weeks"
--  "duration": <days column>
--  "duration_unit": "days"
--  "time_zone": "UTC"
-- }

UPDATE "public"."epoches" SET repeat_data = jsonb_build_object(
  'frequency',      1,
  'frequency_unit', 'weeks',
  'duration',       days,
  'duration_unit',  'days',
  'time_zone',      'UTC'
)
WHERE repeat = 1;

-- For all "monthly" repeating epoches, these are represented as "repeat: 2" in the old schema. In the new schema, these are represented as "
-- {
--  "frequency": 1,
--  "frequency_unit": "months"
--  "duration": <days column>
--  "duration_unit": "days"
--  "time_zone": "UTC"
-- }
UPDATE "public"."epoches" SET repeat_data = jsonb_build_object(
  'frequency',      1,
  'frequency_unit', 'months',
  'duration',       days,
  'duration_unit',  'days',
  'time_zone',      'UTC'
)
WHERE repeat = 2;

COMMIT;

DROP TRIGGER "set_public_activities_updated_at" ON "public"."activities";

DROP TABLE "public"."activities";

alter table "public"."epoches" drop constraint "description_length_constraint";


alter table "public"."circles" drop column "guild_role_id";

alter table "public"."circles" drop column "guild_id";

DROP TRIGGER IF EXISTS set_public_profiles_updated_at on "public"."profiles";
DROP TRIGGER IF EXISTS set_public_distributions_updated_at on "public"."distributions";

BEGIN;
-- Undo the migration by resetting the repeat_data to NULL

UPDATE "public"."epoches" SET repeat_data = NULL
WHERE repeat = 1;

UPDATE "public"."epoches" SET repeat_data = NULL
WHERE repeat = 2;

COMMIT;

alter table "discord"."roles_circles" rename column "discord_role_id" to "server_role";

alter table "public"."nominees" add column "name" varchar;

alter table "public"."circles" rename column "cont_help_text" to "team_sel_text";

alter table profiles drop column connector;
DROP TABLE "public"."locked_token_distribution_gifts";
alter table "public"."locked_token_distributions" add column "distribution_json" jsonb;
alter table "public"."locked_token_distributions" drop column "chain_id" cascade;
alter table "public"."locked_token_distributions" drop column "token_contract_address" cascade;
alter table "public"."locked_token_distributions" drop column "token_symbol" cascade;
alter table "public"."locked_token_distributions" drop column "token_decimals" cascade;

alter table profiles add column ann_power boolean not null default false;
alter table "discord"."roles_circles" rename column "server_role" to "role";

alter table epoches drop column repeat_data;

DROP TABLE "discord"."circle_api_tokens";

alter table "public"."nominees" alter column "name" set not null;

DROP TABLE "public"."locked_token_distributions";

ALTER TABLE "public"."profiles" ALTER COLUMN "name" TYPE character varying;

DROP EXTENSION citext;

alter table "public"."organizations" rename column "sample" to "sandbox";

DROP TABLE "public"."epoch_pgive_data";

alter table "public"."circles" drop column "show_pending_gives";

alter table "public"."epoches" drop column "description";
DROP TABLE "public"."member_epoch_pgives";

alter table "public"."organizations" drop constraint "organizations_created_by_fkey";

alter table "public"."organizations" drop column "created_by";

alter table "public"."contributions" drop constraint "contributions_created_with_api_key_hash_fkey";

alter table "public"."contributions" drop column "created_with_api_key_hash";

alter table "public"."circle_api_keys" drop column "create_contributions";

alter table "public"."circle_api_keys" drop column "read_contributions";

alter table "public"."profiles" drop column "name";
alter table "public"."organizations" drop column "sandbox";
alter table "public"."users" drop column "entrance";

CREATE SEQUENCE IF NOT EXISTS public.migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.migrations (
    id integer DEFAULT nextval('public.migrations_id_seq'::regclass) NOT NULL,
    migration character varying(510) NOT NULL,
    batch integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.failed_jobs (
    id bigint DEFAULT nextval('public.failed_jobs_id_seq'::regclass) NOT NULL,
    uuid character varying(510) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.feedbacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.feedbacks (
    id bigint DEFAULT nextval('public.feedbacks_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    telegram_username character varying(510) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.jobs (
    id bigint DEFAULT nextval('public.jobs_id_seq'::regclass) NOT NULL,
    queue character varying(510) NOT NULL,
    payload text NOT NULL,
    attempts boolean NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);

ALTER TABLE IF EXISTS "public"."organizations" RENAME TO "protocols";
ALTER INDEX IF EXISTS organizations_pkey RENAME TO protocols_pkey;
ALTER TRIGGER set_public_organizations_updated_at ON public.protocols RENAME TO set_public_protocols_updated_at;
ALTER SEQUENCE IF EXISTS public.organizations_id_seq RENAME TO protocols_id_seq;
ALTER TABLE IF EXISTS public.circles RENAME CONSTRAINT circles_organization_id_fkey TO circles_protocol_id_fkey;
ALTER TABLE IF EXISTS public.circles RENAME organization_id TO protocol_id;

alter table "public"."interaction_events" add column "user_id" int4;


alter table "public"."contributions" drop constraint "contributions_user_id_fkey";


DROP TABLE "public"."contributions";

DROP TABLE "public"."interaction_events";
alter table "public"."circles" drop constraint "circles_fixed_payment_vault_id_fkey";

alter table "public"."circles" drop column "fixed_payment_vault_id";

alter table distributions alter column total_amount type numeric using total_amount::numeric;
alter table "public"."distributions" drop constraint "distributions_created_by_fkey";

DROP TABLE "public"."pending_vault_transactions";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- insert into vault_tx_types values ('Claim', null),('Vault_Deploy', 'Deployment of new vault onchain');


alter table "public"."vaults" alter column "token_address" drop not null;

alter table "public"."vaults" alter column "simple_token_address" drop not null;

alter table "public"."circles" drop column "deleted_at" cascade;
alter table "public"."users" alter column "non_receiver" set default 'true';

DROP TRIGGER IF EXISTS set_circle_integrations_updated_at on public."circle_integrations";
alter table "public"."circle_integrations" drop column "updated_at";
alter table "public"."circle_integrations" drop column "created_at";
DROP TRIGGER IF EXISTS set_public_contributions_updated_at on public."contributions";
DROP TABLE "public"."contributions";


alter table "public"."vault_transactions" drop constraint "vault_transactions_tx_type_fkey";

-- could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- insert into vault_tx_types values ('Deposit'),('Withdraw'),('Distribution');

DROP TABLE IF EXISTS "public"."vault_tx_types";

DROP TABLE IF EXISTS "public"."vault_transactions";

alter table "public"."circle_share_tokens" rename to "circle_share_token";

alter table "public"."circle_share_token" drop constraint "circle_share_token_circle_id_fkey";

DROP TABLE "public"."circle_share_token";

alter table "public"."distributions" drop column "fixed_amount";

alter table "public"."distributions" drop column "gift_amount";

alter table "public"."distributions" drop column "distribution_type";

alter table "public"."claims" add column "claimed" bool;
alter table "public"."claims" alter column "claimed"
set
default false;
alter table "public"."claims" alter column "claimed" drop not null;

alter table "public"."circle_api_keys" drop column "read_discord";

DROP TABLE "discord"."users";

DROP TABLE "discord"."roles_circles";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "txHash" varchar
--  null;
alter table "public"."claims" drop column "txHash";


alter table "public"."claims" add column "user_id" int8;
alter table "public"."claims" alter column "user_id" drop not null;
alter table "public"."claims"
  add constraint "claims_user_id_fkey"
  foreign key (user_id)
  references "public"."users"
  (id) on update no action on delete no action;

alter table "public"."claims" drop column "profile_id";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "profile_id" bigint
--  not null;


comment on TABLE "public"."profiles" is E'NULL';

comment on TABLE "public"."users" is E'NULL';

comment on TABLE "public"."token_gifts" is E'NULL';

comment on TABLE "public"."pending_token_gifts" is E'NULL';

alter table "public"."circle_api_keys" drop constraint "circle_api_keys_created_by_fkey";

alter table "public"."circle_api_keys" drop constraint "circle_api_keys_circle_id_fkey";

alter table "public"."vaults" alter column "chain_id" drop not null;

alter table "public"."vaults" drop constraint "vaults_vault_address_key";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "read_epochs" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "read_member_profiles" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "update_pending_token_gifts" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "read_pending_token_gifts" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "create_vouches" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "read_nominees" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "update_circle" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circle_api_keys" add column "read_circle" boolean
--  not null default 'false';


DROP TABLE "public"."circle_api_keys";

alter table "public"."profiles" alter column "admin_view" set default false;
alter table "public"."profiles" alter column "admin_view" drop not null;
alter table "public"."profiles" add column "admin_view" bool;

alter table "public"."distributions" rename column "tx_hash" to "saved_on_chain";
alter table "public"."distributions" alter column "saved_on_chain" set not null;
alter table "public"."distributions" alter column "saved_on_chain" set default 'false';
ALTER TABLE "public"."distributions" ALTER COLUMN "saved_on_chain" TYPE boolean;

DROP VIEW "public"."user_private" IF EXISTS
alter table "public"."users" drop column "fixed_payment_amount";
alter table "public"."circles" drop column "fixed_payment_token_type";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."protocols" add column "logo" varchar
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "chain_id" integer
--  null;

alter table vaults add column created_by bigint not null;

alter table vaults
  add constraint "vaults_created_by_fkey"
  foreign key ("created_by")
  references users ("id") on update no action on delete no action;

DROP TRIGGER IF EXISTS set_public_burns_updated_at on public."burns";
DROP TRIGGER IF EXISTS set_public_circle_metadata_updated_at on public."circle_metadata";
DROP TRIGGER IF EXISTS set_public_circles_updated_at on public."circles";
DROP TRIGGER IF EXISTS set_public_epoches_updated_at on public."epoches";
DROP TRIGGER IF EXISTS set_public_histories_updated_at on public."histories";
DROP TRIGGER IF EXISTS set_public_nominees_updated_at on public."nominees";
DROP TRIGGER IF EXISTS set_public_pending_token_gifts_updated_at on public."pending_token_gifts";
DROP TRIGGER IF EXISTS set_public_personal_access_tokens_updated_at on public."personal_access_tokens";
DROP TRIGGER IF EXISTS set_public_protocols_updated_at on public."protocols";
DROP TRIGGER IF EXISTS set_public_teammates_updated_at on public."teammates";
DROP TRIGGER IF EXISTS set_public_token_gifts_updated_at on public."token_gifts";
DROP TRIGGER IF EXISTS set_public_users_updated_at on public."users";
DROP TRIGGER IF EXISTS set_public_vouches_updated_at on public."vouches";

alter table "public"."vouches" alter column "updated_at" drop not null;

alter table "public"."vouches" alter column "created_at" drop not null;

alter table "public"."users" alter column "updated_at" drop not null;

alter table "public"."users" alter column "created_at" drop not null;

alter table "public"."token_gifts" alter column "updated_at" drop not null;

alter table "public"."token_gifts" alter column "created_at" drop not null;

alter table "public"."teammates" alter column "updated_at" drop not null;

alter table "public"."teammates" alter column "created_at" drop not null;

alter table "public"."protocols" alter column "updated_at" drop not null;

alter table "public"."protocols" alter column "created_at" drop not null;

alter table "public"."profiles" alter column "updated_at" drop not null;

alter table "public"."profiles" alter column "created_at" drop not null;

alter table "public"."personal_access_tokens" alter column "updated_at" drop not null;
ALTER TABLE "public"."personal_access_tokens" ALTER COLUMN "updated_at" drop default;

alter table "public"."personal_access_tokens" alter column "created_at" drop not null;
ALTER TABLE "public"."personal_access_tokens" ALTER COLUMN "created_at" drop default;

alter table "public"."pending_token_gifts" alter column "updated_at" drop not null;

alter table "public"."pending_token_gifts" alter column "created_at" drop not null;

alter table "public"."nominees" alter column "updated_at" drop not null;

alter table "public"."nominees" alter column "created_at" drop not null;

alter table "public"."histories" alter column "updated_at" drop not null;

alter table "public"."histories" alter column "created_at" drop not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."distributions" add column "updated_at" timestamp
--  not null default now();

alter table "public"."circles" alter column "updated_at" drop not null;

alter table "public"."circles" alter column "created_at" drop not null;

alter table "public"."circle_metadata" alter column "updated_at" drop not null;
ALTER TABLE "public"."circle_metadata" ALTER COLUMN "updated_at" drop default;

alter table "public"."circle_metadata" alter column "created_at" drop not null;
ALTER TABLE "public"."circle_metadata" ALTER COLUMN "created_at" drop default;

alter table "public"."burns" alter column "updated_at" drop not null;
ALTER TABLE "public"."burns" ALTER COLUMN "updated_at" drop default;

alter table "public"."burns" alter column "created_at" drop not null;
ALTER TABLE "public"."burns" ALTER COLUMN "created_at" drop default;

alter table "public"."users" drop constraint "users_address_circle_id_deleted_at_key";

DROP TRIGGER IF EXISTS users_insert_trigger on "users";
DROP FUNCTION IF EXISTS function_ensure_profile_exists();
alter table "public"."epoches" drop constraint "epoches_circle_id_fkey";

alter table "public"."users" drop constraint "users_address_fkey";

ALTER TABLE "public"."nominees" ALTER COLUMN "expiry_date" TYPE date;

alter table "public"."circles" drop constraint "circles_protocol_id_fkey";

alter table "public"."epoches" alter column "created_at" drop not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- UPDATE "public"."epoches" set created_at=start_date where created_at is null;

alter table "public"."epoches" alter column "start_date" drop not null;

alter table "public"."epoches" alter column "updated_at" drop not null;

alter table "public"."pending_token_gifts" drop constraint if exists "pending_token_gifts_sender_id_recipient_id_epoch_id_key";

alter table "public"."pending_token_gifts" alter column "epoch_id" drop not null;

alter table "public"."token_gifts"
  drop constraint "token_gifts_epoch_id_fkey";

alter table "public"."nominees"
  drop constraint "nominees_circle_id_fkey";

alter table "public"."vouches"
  drop constraint "vouches_nominee_id_fkey";

alter table "public"."vouches"
  drop constraint "vouches_voucher_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."distributions" add column "distribution_epoch_id" bigint
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."distributions" add column "distribution_json" jsonb
--  not null default '{}';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "new_amount" numeric
--  not null default '0';

alter table "public"."teammates" drop constraint "teammates_user_id_team_mate_id_key";

alter table "public"."profiles" drop constraint "valid_website";


alter table "public"."vaults" alter column "symbol" drop not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."distributions" add column "saved_on_chain" boolean
--  not null default 'false';


alter table "public"."protocols" alter column "updated_at" set not null;

alter table "public"."protocols" alter column "created_at" set not null;

alter table "public"."circles" alter column "updated_at" set not null;

alter table "public"."circles" alter column "created_at" set not null;

alter table "public"."circles" drop column "contact";


ALTER TABLE "public"."claims" ALTER COLUMN "amount" TYPE bigint;

alter table "public"."claims" drop constraint "claims_distribution_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "distribution_id" bigint
--  not null;

DROP TABLE "public"."distributions";


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."distributions";

alter table "public"."claims"
  add constraint "claims_distribution_id_fkey"
  foreign key (distribution_id)
  references "public"."distributions"
  (id) on update no action on delete no action;
alter table "public"."claims" alter column "distribution_id" drop not null;
alter table "public"."claims" add column "distribution_id" int8;


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."circles" add column "contact" text
--  null;

alter table "public"."circles" drop column "contact";

alter table "public"."protocols" alter column "updated_at" drop not null;

alter table "public"."protocols" alter column "created_at" drop not null;

alter table "public"."circles" alter column "protocol_id" drop not null;

alter table "public"."circles" alter column "updated_at" drop not null;

alter table "public"."circles" alter column "created_at" drop not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "vault_address" text
--  not null;

alter table "public"."vaults" alter column "owner_id" drop not null;
alter table "public"."vaults" add column "owner_id" int8;


alter table "public"."claims" drop constraint "claims_updated_by_fkey";

alter table "public"."claims" drop constraint "claims_created_by_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "updated_by" int8
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "updated_at" timestamptz
--  not null default now();
--
-- CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER "set_public_claims_updated_at"
-- BEFORE UPDATE ON "public"."claims"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_claims_updated_at" ON "public"."claims"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "created_by" int8
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "created_at" timestamptz
--  not null default now();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."claims" add column "claimed" boolean
--  not null default 'false';

alter table "public"."claims" alter column "flag" drop not null;
alter table "public"."claims" add column "flag" bool;


alter table "public"."distributions" alter column "updated_at" set default now();
alter table "public"."distributions" alter column "updated_at" drop not null;
alter table "public"."distributions" add column "updated_at" timestamp;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."distributions" add column "total_amount" numeric
--  not null;

alter table "public"."distributions" alter column "total_amount" drop not null;
alter table "public"."distributions" add column "total_amount" varchar;


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "updated_at" timestamptz
--  not null default now();
--
-- CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER "set_public_vaults_updated_at"
-- BEFORE UPDATE ON "public"."vaults"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_vaults_updated_at" ON "public"."vaults"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "created_at" timestamptz
--  not null default now();

alter table "public"."vaults" alter column "updated_at" set default now();
alter table "public"."vaults" alter column "updated_at" drop not null;
alter table "public"."vaults" add column "updated_at" timestamp;

alter table "public"."vaults" alter column "created_at" set default now();
alter table "public"."vaults" alter column "created_at" drop not null;
alter table "public"."vaults" add column "created_at" timestamp;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."vaults" add column "symbol" Text
--  null;

alter table "public"."vaults" alter column "type" drop not null;
alter table "public"."vaults" add column "type" int4;

DROP TABLE "public"."claims";

DROP TABLE "public"."distributions";

DROP TABLE "public"."vault_transactions";

DROP TABLE "public"."vaults";

DROP TABLE "public"."circle_integrations";


DROP VIEW public.pending_gift_private IF EXISTS

DROP VIEW public.gift_private IF EXISTS

DROP VIEW public.circle_private IF EXISTS
