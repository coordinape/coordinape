
SET check_function_bodies = false;
CREATE SEQUENCE public.burns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.burns (
    id bigint DEFAULT nextval('public.burns_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    epoch_id bigint NOT NULL,
    circle_id bigint NOT NULL,
    tokens_burnt integer NOT NULL,
    regift_percent integer NOT NULL,
    original_amount integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE SEQUENCE public.circle_metadata_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.circle_metadata (
    id bigint DEFAULT nextval('public.circle_metadata_id_seq'::regclass) NOT NULL,
    circle_id bigint NOT NULL,
    json json,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE SEQUENCE public.circles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.circles (
    id bigint DEFAULT nextval('public.circles_id_seq'::regclass) NOT NULL,
    name character varying(510) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    protocol_id integer,
    token_name character varying(510) DEFAULT 'GIVE'::character varying NOT NULL,
    team_sel_text text,
    alloc_text text,
    telegram_id character varying(510) DEFAULT NULL::character varying,
    logo character varying(510) DEFAULT NULL::character varying,
    vouching boolean DEFAULT false NOT NULL,
    min_vouches integer DEFAULT 2 NOT NULL,
    nomination_days_limit integer DEFAULT 14 NOT NULL,
    vouching_text text,
    default_opt_in boolean DEFAULT false NOT NULL,
    team_selection boolean DEFAULT true NOT NULL,
    discord_webhook character varying(510) DEFAULT NULL::character varying,
    only_giver_vouch boolean DEFAULT true NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    auto_opt_out boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.epoches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.epoches (
    id bigint DEFAULT nextval('public.epoches_id_seq'::regclass) NOT NULL,
    number integer,
    start_date timestamp with time zone,
    end_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    circle_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ended boolean DEFAULT false NOT NULL,
    notified_start timestamp without time zone,
    notified_before_end timestamp without time zone,
    notified_end timestamp without time zone,
    "grant" numeric(20,2) DEFAULT 0.00 NOT NULL,
    regift_days integer DEFAULT 1 NOT NULL,
    days integer,
    repeat integer DEFAULT 0 NOT NULL,
    repeat_day_of_month integer DEFAULT 0 NOT NULL
);
CREATE SEQUENCE public.failed_jobs_id_seq
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
CREATE SEQUENCE public.feedbacks_id_seq
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
CREATE SEQUENCE public.histories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.histories (
    id bigint DEFAULT nextval('public.histories_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    bio text,
    epoch_id integer NOT NULL,
    circle_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.jobs_id_seq
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
CREATE SEQUENCE public.migrations_id_seq
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
CREATE SEQUENCE public.nominees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.nominees (
    id bigint DEFAULT nextval('public.nominees_id_seq'::regclass) NOT NULL,
    name character varying(510) NOT NULL,
    address character varying(510) NOT NULL,
    nominated_by_user_id integer NOT NULL,
    circle_id integer NOT NULL,
    description text NOT NULL,
    nominated_date date NOT NULL,
    expiry_date date NOT NULL,
    vouches_required integer NOT NULL,
    user_id integer,
    ended boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.pending_token_gifts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.pending_token_gifts (
    id bigint DEFAULT nextval('public.pending_token_gifts_id_seq'::regclass) NOT NULL,
    sender_id bigint NOT NULL,
    sender_address character varying(510) NOT NULL,
    recipient_id bigint NOT NULL,
    recipient_address character varying(510) NOT NULL,
    tokens integer NOT NULL,
    note text,
    dts_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    circle_id bigint NOT NULL,
    epoch_id integer
);
CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.personal_access_tokens (
    id bigint DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass) NOT NULL,
    tokenable_type character varying(510) NOT NULL,
    tokenable_id bigint NOT NULL,
    name character varying(510) NOT NULL,
    token character varying(128) NOT NULL,
    abilities text,
    last_used_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE SEQUENCE public.profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.profiles (
    id bigint DEFAULT nextval('public.profiles_id_seq'::regclass) NOT NULL,
    avatar character varying(510) DEFAULT NULL::character varying,
    background character varying(510) DEFAULT NULL::character varying,
    skills text,
    bio text,
    telegram_username character varying(510) DEFAULT NULL::character varying,
    discord_username character varying(510) DEFAULT NULL::character varying,
    twitter_username character varying(510) DEFAULT NULL::character varying,
    github_username character varying(510) DEFAULT NULL::character varying,
    medium_username character varying(510) DEFAULT NULL::character varying,
    website character varying(510) DEFAULT NULL::character varying,
    address character varying(510) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    admin_view boolean DEFAULT false NOT NULL,
    ann_power boolean DEFAULT false NOT NULL,
    chat_id character varying(510) DEFAULT NULL::character varying
);
CREATE SEQUENCE public.protocols_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.protocols (
    id bigint DEFAULT nextval('public.protocols_id_seq'::regclass) NOT NULL,
    name character varying(510) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    telegram_id character varying(510) DEFAULT NULL::character varying,
    is_verified boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.teammates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.teammates (
    id bigint DEFAULT nextval('public.teammates_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    team_mate_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.token_gifts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.token_gifts (
    id bigint DEFAULT nextval('public.token_gifts_id_seq'::regclass) NOT NULL,
    sender_id bigint NOT NULL,
    sender_address character varying(510) NOT NULL,
    recipient_id bigint NOT NULL,
    recipient_address character varying(510) NOT NULL,
    tokens integer NOT NULL,
    note text,
    dts_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    circle_id bigint NOT NULL,
    epoch_id integer NOT NULL
);
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.users (
    id bigint DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    name character varying(510) NOT NULL,
    address character varying(510) NOT NULL,
    give_token_received integer DEFAULT 0 NOT NULL,
    give_token_remaining integer DEFAULT 100 NOT NULL,
    role integer DEFAULT 0 NOT NULL,
    non_receiver boolean DEFAULT true NOT NULL,
    circle_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bio text,
    epoch_first_visit boolean DEFAULT true NOT NULL,
    non_giver boolean DEFAULT false NOT NULL,
    deleted_at timestamp without time zone,
    starting_tokens integer DEFAULT 100 NOT NULL,
    fixed_non_receiver boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.vouches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.vouches (
    id bigint DEFAULT nextval('public.vouches_id_seq'::regclass) NOT NULL,
    voucher_id integer NOT NULL,
    nominee_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE ONLY public.burns
    ADD CONSTRAINT burns_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.circle_metadata
    ADD CONSTRAINT circle_metadata_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.circles
    ADD CONSTRAINT circles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.epoches
    ADD CONSTRAINT epoches_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_key UNIQUE (uuid);
ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.histories
    ADD CONSTRAINT histories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.nominees
    ADD CONSTRAINT nominees_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pending_token_gifts
    ADD CONSTRAINT pending_token_gifts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_key UNIQUE (token);
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_address_key UNIQUE (address);
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.protocols
    ADD CONSTRAINT protocols_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.teammates
    ADD CONSTRAINT teammates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.token_gifts
    ADD CONSTRAINT token_gifts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.vouches
    ADD CONSTRAINT vouches_pkey PRIMARY KEY (id);
CREATE INDEX burns_circle_id_idx ON public.burns USING btree (circle_id);
CREATE INDEX burns_epoch_id_idx ON public.burns USING btree (epoch_id);
CREATE INDEX burns_user_id_idx ON public.burns USING btree (user_id);
CREATE INDEX circle_metadata_circle_id_idx ON public.circle_metadata USING btree (circle_id);
CREATE INDEX pending_token_gifts_circle_id_idx ON public.pending_token_gifts USING btree (circle_id);
CREATE INDEX pending_token_gifts_recipient_id_idx ON public.pending_token_gifts USING btree (recipient_id);
CREATE INDEX pending_token_gifts_sender_id_idx ON public.pending_token_gifts USING btree (sender_id);
CREATE INDEX token_gifts_circle_id_idx ON public.token_gifts USING btree (circle_id);
CREATE INDEX token_gifts_recipient_id_idx ON public.token_gifts USING btree (recipient_id);
CREATE INDEX token_gifts_sender_id_idx ON public.token_gifts USING btree (sender_id);
CREATE INDEX users_circle_id_idx ON public.users USING btree (circle_id);
ALTER TABLE ONLY public.burns
    ADD CONSTRAINT burns_circle_id_foreign FOREIGN KEY (circle_id) REFERENCES public.circles(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.burns
    ADD CONSTRAINT burns_epoch_id_foreign FOREIGN KEY (epoch_id) REFERENCES public.epoches(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.burns
    ADD CONSTRAINT burns_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.circle_metadata
    ADD CONSTRAINT circle_metadata_circle_id_foreign FOREIGN KEY (circle_id) REFERENCES public.circles(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.pending_token_gifts
    ADD CONSTRAINT pending_token_gifts_circle_id_foreign FOREIGN KEY (circle_id) REFERENCES public.circles(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.pending_token_gifts
    ADD CONSTRAINT pending_token_gifts_recipient_id_foreign FOREIGN KEY (recipient_id) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.pending_token_gifts
    ADD CONSTRAINT pending_token_gifts_sender_id_foreign FOREIGN KEY (sender_id) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.token_gifts
    ADD CONSTRAINT token_gifts_circle_id_foreign FOREIGN KEY (circle_id) REFERENCES public.circles(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.token_gifts
    ADD CONSTRAINT token_gifts_recipient_id_foreign FOREIGN KEY (recipient_id) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.token_gifts
    ADD CONSTRAINT token_gifts_sender_id_foreign FOREIGN KEY (sender_id) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_circle_id_foreign FOREIGN KEY (circle_id) REFERENCES public.circles(id) DEFERRABLE INITIALLY DEFERRED;



CREATE or REPLACE VIEW public.circle_private AS
  SELECT id AS circle_id, discord_webhook
    FROM circles;

CREATE or REPLACE VIEW public.gift_private AS
 SELECT id as gift_id, recipient_id, sender_id, note
   FROM token_gifts;

CREATE or REPLACE VIEW public.pending_gift_private AS
 SELECT id as gift_id, recipient_id, sender_id, note
   FROM pending_token_gifts;

CREATE TABLE "public"."circle_integrations" ("id" bigserial NOT NULL, "circle_id" bigint NOT NULL, "name" text NOT NULL, "type" text NOT NULL, "data" json NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));

CREATE TABLE "public"."vaults"
(
  "id" bigserial NOT NULL,
  "token_address" varchar,
  "simple_token_address" varchar,
  "type" integer NOT NULL,
  "org_id" bigint NOT NULL,
  "decimals" integer NOT NULL,
  "owner_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("org_id") REFERENCES "public"."protocols"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
);

CREATE TABLE "public"."vault_transactions"
(
  "id" bigserial NOT NULL,
  "name" varchar NOT NULL,
  "tx_hash" varchar NOT NULL,
  "description" varchar NULL,
  "value" bigint,
  "date" Date NOT NULL,
  "vault_id" bigint NOT NULL,
  "created_by" bigint,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"
()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW
();
RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_vault_transactions_updated_at"
BEFORE
UPDATE ON "public"."vault_transactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"
."set_current_timestamp_updated_at"
();
COMMENT ON TRIGGER "set_public_vault_transactions_updated_at" ON "public"."vault_transactions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."distributions"
(
  "id" bigint NOT NULL,
  "epoch_id" bigint NOT NULL,
  "merkle_root" varchar NOT NULL,
  "total_amount" varchar NOT NULL,
  "vault_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "created_at" Timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action,
  FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE no action ON DELETE no action,
  UNIQUE ("id")
);

CREATE TABLE "public"."claims" ("id" bigserial NOT NULL, "distribution_id" bigint NOT NULL, "index" bigint NOT NULL, "proof" varchar NOT NULL, "address" varchar NOT NULL, "flag" boolean NOT NULL, "amount" bigint NOT NULL, "user_id" bigint NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("distribution_id") REFERENCES "public"."distributions"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action, UNIQUE ("id"));


alter table "public"."vaults" drop column "type" cascade;

alter table "public"."vaults" add column "symbol" Text
 null;

alter table "public"."vaults" drop column "created_at" cascade;

alter table "public"."vaults" drop column "updated_at" cascade;

alter table "public"."vaults" add column "created_at" timestamptz
 not null default now();

alter table "public"."vaults" add column "updated_at" timestamptz
 not null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_vaults_updated_at"
BEFORE UPDATE ON "public"."vaults"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_vaults_updated_at" ON "public"."vaults" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


alter table "public"."distributions" drop column "total_amount" cascade;

alter table "public"."distributions" add column "total_amount" numeric
 not null;

alter table "public"."distributions" drop column "updated_at" cascade;


alter table "public"."claims" drop column "flag" cascade;

alter table "public"."claims" add column "claimed" boolean
 not null default 'false';

alter table "public"."claims" add column "created_at" timestamptz
 not null default now();

alter table "public"."claims" add column "created_by" int8
 not null;

alter table "public"."claims" add column "updated_at" timestamptz
 not null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_claims_updated_at"
BEFORE UPDATE ON "public"."claims"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_claims_updated_at" ON "public"."claims" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."claims" add column "updated_by" int8
 not null;

alter table "public"."claims"
  add constraint "claims_created_by_fkey"
  foreign key ("created_by")
  references "public"."users"
  ("id") on update no action on delete no action;

alter table "public"."claims"
  add constraint "claims_updated_by_fkey"
  foreign key ("updated_by")
  references "public"."users"
  ("id") on update no action on delete no action;

alter table "public"."vaults" drop column "owner_id" cascade;

alter table "public"."vaults" add column "vault_address" text
 not null;


alter table "public"."circles" alter column "created_at" set not null;

alter table "public"."circles" alter column "updated_at" set not null;

alter table "public"."circles" alter column "protocol_id" set not null;

alter table "public"."protocols" alter column "created_at" set not null;

alter table "public"."protocols" alter column "updated_at" set not null;

alter table "public"."circles" add column if not exists "contact" text null;


alter table "public"."claims" drop column "distribution_id" cascade;

DROP table "public"."distributions";


CREATE TABLE "public"."distributions" ("id" bigserial NOT NULL, "epoch_id" bigint NOT NULL, "merkle_root" varchar, "vault_id" bigint NOT NULL, "total_amount" numeric NOT NULL, "created_at" timestamp NOT NULL DEFAULT now(), "created_by" bigint NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE no action ON DELETE no action, UNIQUE ("id"));COMMENT ON TABLE "public"."distributions" IS E'Vault Distributions';

alter table "public"."claims" add column "distribution_id" bigint
 not null;

alter table "public"."claims"
  add constraint "claims_distribution_id_fkey"
  foreign key ("distribution_id")
  references "public"."distributions"
  ("id") on update no action on delete no action;

ALTER TABLE "public"."claims" ALTER COLUMN "amount" TYPE numeric;


alter table "public"."circles" alter column "created_at" drop not null;

alter table "public"."circles" alter column "updated_at" drop not null;

alter table "public"."protocols" alter column "created_at" drop not null;

alter table "public"."protocols" alter column "updated_at" drop not null;

alter table "public"."circles" add column if not exists "contact" text
    null;


alter table "public"."distributions" add column "saved_on_chain" boolean
 not null default 'false';

alter table "public"."vaults" alter column "symbol" set not null;

update "public"."profiles" set website = CONCAT('https://',website) where website not ilike 'https://%' and website not ilike 'http://%' and website is not null;
-- update these three specific users, making sure they have these y.at addresses
update "public"."profiles" set website = RTRIM(website) where website is not null;
update "public"."profiles" set website='https://y.at/mountain.crown.mountain' where id=7056 AND website ilike 'https://y.at%';
update "public"."profiles" set website='https://y.at/fox.rocket.rainbow' where id=3117 AND website ilike 'https://y.at%';
update "public"."profiles" set website='https://y.at/teacup.ocean.sparkles.half-moon' where id=566 AND website ilike 'https://y.at%';
update "public"."profiles" set website=NULL where id=706;
alter table "public"."profiles" add constraint "valid_website" check (website::text ~* 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,255}\.[a-z]{2,9}\y([-a-zA-Z0-9@:%_\+.,~#?!&>//=]*)$'::text OR website IS NULL);

alter table "public"."teammates" add constraint "teammates_user_id_team_mate_id_key" unique ("user_id", "team_mate_id");


alter table "public"."claims" add column "new_amount" numeric
 not null default '0';

alter table "public"."distributions" add column "distribution_json" jsonb
 not null default '{}';

alter table "public"."distributions" add column "distribution_epoch_id" bigint
 null;

alter table "public"."nominees"
  add constraint "nominees_circle_id_fkey"
  foreign key ("circle_id")
  references "public"."circles"
  ("id") on update no action on delete no action;

alter table "public"."vouches"
  add constraint "vouches_voucher_id_fkey"
  foreign key ("voucher_id")
  references "public"."users"
  ("id") on update no action on delete no action;

alter table "public"."vouches"
  add constraint "vouches_nominee_id_fkey"
  foreign key ("nominee_id")
  references "public"."nominees"
  ("id") on update no action on delete no action;

alter table "public"."token_gifts"
  add constraint "token_gifts_epoch_id_fkey"
  foreign key ("epoch_id")
  references "public"."epoches"
  ("id") on update no action on delete no action;


alter table "public"."pending_token_gifts" alter column "epoch_id" set not null;

alter table "public"."pending_token_gifts" add constraint "pending_token_gifts_sender_id_recipient_id_epoch_id_key" unique ("sender_id", "recipient_id", "epoch_id");

alter table "public"."epoches" alter column "updated_at" set not null;

alter table "public"."epoches" alter column "start_date" set not null;

UPDATE "public"."epoches" set created_at=start_date where created_at is null;

alter table "public"."epoches" alter column "created_at" set not null;

alter table "public"."circles"
  add constraint "circles_protocol_id_fkey"
  foreign key ("protocol_id")
  references "public"."protocols"
  ("id") on update restrict on delete restrict;

ALTER TABLE "public"."nominees" ALTER COLUMN "expiry_date" TYPE timestamp;

alter table "public"."users"
  add constraint "users_address_fkey"
  foreign key ("address")
  references "public"."profiles"
  ("address") on update restrict on delete restrict;

alter table "public"."epoches"
  add constraint "epoches_circle_id_fkey"
  foreign key ("circle_id")
  references "public"."circles"
  ("id") on update restrict on delete restrict;

CREATE OR REPLACE FUNCTION function_ensure_profile_exists() RETURNS TRIGGER AS
$BODY$
  BEGIN
      INSERT INTO "profiles"(address) VALUES(new.address) ON CONFLICT DO NOTHING;
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

alter table "public"."users" add constraint "users_address_circle_id_deleted_at_key" unique ("address", "circle_id", "deleted_at");

update "public"."profiles" set avatar = CONCAT('assets/static/images/',avatar)
where avatar not like 'assets/static/images/%' and avatar is not null;

update "public"."profiles" set background = CONCAT('assets/static/images/',background)
where background not like 'assets/static/images/%' and background is not null;

update "public"."circles" set logo = CONCAT('assets/static/images/',logo)
where logo not like 'assets/static/images/%' and logo is not null;

alter table "public"."burns" alter column "created_at" set default now();
alter table "public"."burns" alter column "created_at" set not null;

alter table "public"."burns" alter column "updated_at" set default now();
alter table "public"."burns" alter column "updated_at" set not null;

alter table "public"."circle_metadata" alter column "created_at" set default now();
alter table "public"."circle_metadata" alter column "created_at" set not null;

alter table "public"."circle_metadata" alter column "updated_at" set default now();
alter table "public"."circle_metadata" alter column "updated_at" set not null;

alter table "public"."circles" alter column "created_at" set not null;

alter table "public"."circles" alter column "updated_at" set not null;

alter table "public"."distributions" add column "updated_at" timestamp
 not null default now();

alter table "public"."histories" alter column "created_at" set not null;

alter table "public"."histories" alter column "updated_at" set not null;

alter table "public"."nominees" alter column "created_at" set not null;

alter table "public"."nominees" alter column "updated_at" set not null;

alter table "public"."pending_token_gifts" alter column "created_at" set not null;

alter table "public"."pending_token_gifts" alter column "updated_at" set not null;

alter table "public"."personal_access_tokens" alter column "created_at" set default now();
alter table "public"."personal_access_tokens" alter column "created_at" set not null;

alter table "public"."personal_access_tokens" alter column "updated_at" set default now();
alter table "public"."personal_access_tokens" alter column "updated_at" set not null;

update "public"."profiles" set created_at='2000-01-01' where created_at is null;
alter table "public"."profiles" alter column "created_at" set not null;

update "public"."profiles" set updated_at='2000-01-01' where updated_at is null;
alter table "public"."profiles" alter column "updated_at" set not null;

alter table "public"."protocols" alter column "created_at" set not null;

alter table "public"."protocols" alter column "updated_at" set not null;

update "public"."teammates" set created_at='2000-01-01' where created_at is null;
alter table "public"."teammates" alter column "created_at" set not null;

update "public"."teammates" set updated_at='2000-01-01' where updated_at is null;
alter table "public"."teammates" alter column "updated_at" set not null;

alter table "public"."token_gifts" alter column "created_at" set not null;

alter table "public"."token_gifts" alter column "updated_at" set not null;

update "public"."users" set created_at='2000-01-01' where created_at is null;
alter table "public"."users" alter column "created_at" set not null;

update "public"."users" set updated_at='2000-01-01' where updated_at is null;
alter table "public"."users" alter column "updated_at" set not null;

update "public"."vouches" set created_at='2000-01-01' where created_at is null;
alter table "public"."vouches" alter column "created_at" set not null;

update "public"."vouches" set updated_at='2000-01-01' where updated_at is null;
alter table "public"."vouches" alter column "updated_at" set not null;

-- burns
DO $$
BEGIN
    CREATE TRIGGER "set_public_burns_updated_at"
    BEFORE UPDATE ON "public"."burns"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_burns_updated_at" ON "public"."burns"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- circle_metadata
DO $$
BEGIN
    CREATE TRIGGER "set_public_circle_metadata_updated_at"
    BEFORE UPDATE ON "public"."circle_metadata"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_circle_metadata_updated_at" ON "public"."circle_metadata"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- circles
DO $$
BEGIN
    CREATE TRIGGER "set_public_circles_updated_at"
    BEFORE UPDATE ON "public"."circles"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_circles_updated_at" ON "public"."circles"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- epoches
DO $$
BEGIN
    CREATE TRIGGER "set_public_epoches_updated_at"
    BEFORE UPDATE ON "public"."epoches"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_epoches_updated_at" ON "public"."epoches"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- histories
DO $$
BEGIN
    CREATE TRIGGER "set_public_histories_updated_at"
    BEFORE UPDATE ON "public"."histories"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_histories_updated_at" ON "public"."histories"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- nominees
DO $$
BEGIN
    CREATE TRIGGER "set_public_nominees_updated_at"
    BEFORE UPDATE ON "public"."nominees"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_nominees_updated_at" ON "public"."nominees"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- pending_token_gifts
DO $$
BEGIN
    CREATE TRIGGER "set_public_pending_token_gifts_updated_at"
    BEFORE UPDATE ON "public"."pending_token_gifts"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_pending_token_gifts_updated_at" ON "public"."pending_token_gifts"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- personal_access_tokens
DO $$
BEGIN
    CREATE TRIGGER "set_public_personal_access_tokens_updated_at"
    BEFORE UPDATE ON "public"."personal_access_tokens"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_personal_access_tokens_updated_at" ON "public"."personal_access_tokens"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- protocols
DO $$
BEGIN
    CREATE TRIGGER "set_public_protocols_updated_at"
    BEFORE UPDATE ON "public"."protocols"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_protocols_updated_at" ON "public"."protocols"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- teammates
DO $$
BEGIN
    CREATE TRIGGER "set_public_teammates_updated_at"
    BEFORE UPDATE ON "public"."teammates"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_teammates_updated_at" ON "public"."teammates"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- token_gifts
DO $$
BEGIN
    CREATE TRIGGER "set_public_token_gifts_updated_at"
    BEFORE UPDATE ON "public"."token_gifts"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_token_gifts_updated_at" ON "public"."token_gifts"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- users
DO $$
BEGIN
    CREATE TRIGGER "set_public_users_updated_at"
    BEFORE UPDATE ON "public"."users"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_users_updated_at" ON "public"."users"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- vouches
DO $$
BEGIN
    CREATE TRIGGER "set_public_vouches_updated_at"
    BEFORE UPDATE ON "public"."vouches"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_vouches_updated_at" ON "public"."vouches"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

alter table vaults drop column created_by;
alter table vaults add column created_by bigint not null;

alter table vaults
  add constraint "vaults_created_by_fkey"
  foreign key ("created_by")
  references profiles ("id") on update no action on delete no action;

alter table claims drop column created_by;
alter table claims drop column updated_by;
alter table "public"."vaults" add column "chain_id" integer
 null;

alter table "public"."protocols" add column "logo" varchar
 null;

alter table "public"."circles" add column "fixed_payment_token_type" varchar
 null;

alter table "public"."users" add column "fixed_payment_amount" numeric
 not null default '0.00';

CREATE OR REPLACE VIEW "public"."user_private" AS 
 SELECT us.id AS user_id,
    cr.fixed_payment_token_type,
    us.fixed_payment_amount,
    us.circle_id
   FROM users us
   LEFT JOIN circles cr ON cr.id = us.circle_id;

ALTER TABLE "public"."distributions" ALTER COLUMN "saved_on_chain" TYPE varchar;
ALTER TABLE "public"."distributions" ALTER COLUMN "saved_on_chain" drop default;
alter table "public"."distributions" alter column "saved_on_chain" drop not null;
alter table "public"."distributions" rename column "saved_on_chain" to "tx_hash";

alter table "public"."profiles" drop column "admin_view" cascade;


CREATE TABLE "public"."circle_api_keys" ("hash" text NOT NULL, "circle_id" int8 NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "created_by" int8 NOT NULL, "name" text NOT NULL, PRIMARY KEY ("hash") , UNIQUE ("hash"));COMMENT ON TABLE "public"."circle_api_keys" IS E'Circle-scoped API keys with user defined permissions to allow third parties to authenticate to Coordinape\'s GraphQL API.';


alter table "public"."circle_api_keys" add column "read_circle" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "update_circle" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_nominees" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "create_vouches" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_pending_token_gifts" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "update_pending_token_gifts" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_member_profiles" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_epochs" boolean
 not null default 'false';


alter table "public"."vaults" add constraint "vaults_vault_address_key" unique ("vault_address");

alter table "public"."vaults" alter column "chain_id" set not null;

alter table "public"."circle_api_keys"
  add constraint "circle_api_keys_circle_id_fkey"
  foreign key ("circle_id")
  references "public"."circles"
  ("id") on update restrict on delete cascade;

alter table "public"."circle_api_keys"
  add constraint "circle_api_keys_created_by_fkey"
  foreign key ("created_by")
  references "public"."users"
  ("id") on update restrict on delete restrict;


comment on TABLE "public"."pending_token_gifts" is E'GIVE allocations made by circle members for the currently running epoch';

comment on TABLE "public"."token_gifts" is E'GIVE allocations made by circle members for completed epochs';

comment on TABLE "public"."users" is E'Members of a circle';

comment on TABLE "public"."profiles" is E'Coordinape user accounts that can belong to one or many circles via the relationship to the users table';


alter table "public"."claims" add column "profile_id" bigint
 not null;

alter table "public"."claims" drop column "user_id" cascade;

alter table "public"."claims" add column "txHash" varchar
 null;

CREATE SCHEMA IF NOT EXISTS discord;

CREATE TABLE "discord"."roles_circles" ("id" bigserial NOT NULL, "circle_id" int8 NOT NULL, "role" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("circle_id"));COMMENT ON TABLE "discord"."roles_circles" IS E'link a discord role to a circle  to control membership of the circle';
CREATE OR REPLACE FUNCTION "discord"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_discord_roles_circles_updated_at"
BEFORE UPDATE ON "discord"."roles_circles"
FOR EACH ROW
EXECUTE PROCEDURE "discord"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_discord_roles_circles_updated_at" ON "discord"."roles_circles"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "discord"."users" ("id" bigserial NOT NULL, "user_snowflake" text NOT NULL, "profile_id" int8 NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("user_snowflake"), UNIQUE ("profile_id"));COMMENT ON TABLE "discord"."users" IS E'link discord user ids to coordinape profiles 1:1';
CREATE OR REPLACE FUNCTION "discord"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_discord_users_updated_at"
BEFORE UPDATE ON "discord"."users"
FOR EACH ROW
EXECUTE PROCEDURE "discord"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_discord_users_updated_at" ON "discord"."users" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."circle_api_keys" add column "read_discord" boolean
 not null default 'false';

alter table "public"."claims" drop column "claimed" cascade;

alter table "public"."distributions" add column "distribution_type" integer
 not null default '1';

alter table "public"."distributions" add column "gift_amount" numeric
 not null default '0';

alter table "public"."distributions" add column "fixed_amount" numeric
 not null default '0';

CREATE TABLE "public"."circle_share_token" ("circle_id" bigint NOT NULL, "type" integer NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("circle_id","type") , UNIQUE ("uuid"));
--CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
-- $$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_circle_share_token_updated_at"
BEFORE UPDATE ON "public"."circle_share_token"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_circle_share_token_updated_at" ON "public"."circle_share_token" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."circle_share_token"
  add constraint "circle_share_token_circle_id_fkey"
  foreign key ("circle_id")
  references "public"."circles"
  ("id") on update restrict on delete restrict;

alter table "public"."circle_share_token" rename to "circle_share_tokens";

-- add deployment_block column
alter table "public"."vaults" add column if not exists "deployment_block" bigint
 default 6800000 -- a pre-testing block on goerli; still valid on mainnet
 not null;

-- It's easier to drop and recreate the table wholesale
DROP table IF EXISTS "public"."vault_transactions";

CREATE TABLE "public"."vault_transactions" (
  "id" bigserial NOT NULL,
  "tx_hash" text NOT NULL,
  "vault_id" bigint NOT NULL,
  "tx_type" text NOT NULL,
  "created_by" bigint,
  "distribution_id" bigint,
  "circle_id" bigint,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("distribution_id") REFERENCES "public"."distributions"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id")
);
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

CREATE TRIGGER "set_public_vault_transactions_updated_at"
BEFORE UPDATE ON "public"."vault_transactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_vault_transactions_updated_at" ON "public"."vault_transactions"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."vault_tx_types" ("value" text NOT NULL, "comment" text, PRIMARY KEY ("value") , UNIQUE ("value"));

insert into vault_tx_types values ('Deposit'),('Withdraw'),('Distribution');

alter table "public"."vault_transactions"
  add constraint "vault_transactions_tx_type_fkey"
  foreign key ("tx_type")
  references "public"."vault_tx_types"
  ("value") on update restrict on delete restrict;

CREATE TABLE "public"."contributions"
(
    "id" serial NOT NULL,
    "epoch_id" integer,
    "user_id" integer NOT NULL,
    "description" text,
    "deleted_at" timestamptz,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id") ,
    FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id"));

DO $$
BEGIN
    CREATE TRIGGER "set_public_contributions_updated_at"
    BEFORE UPDATE ON "public"."contributions"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_contributions_updated_at" ON "public"."contributions"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

alter table "public"."circle_integrations" add column "created_at" timestamptz NOT NULL DEFAULT now();

alter table "public"."circle_integrations" add column "updated_at" timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
    CREATE TRIGGER "set_circle_integrations_updated_at"
    BEFORE UPDATE ON "public"."circle_integrations"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_circle_integrations_updated_at" ON "public"."circle_integrations"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;
alter table "public"."users" alter column "non_receiver" set default 'false';

alter table "public"."circles" add column "deleted_at" timestamp
 null;


alter table "public"."vaults" alter column "simple_token_address" set not null;

alter table "public"."vaults" alter column "token_address" set not null;



insert into vault_tx_types values ('Claim', null),('Vault_Deploy', 'Deployment of new vault onchain');

CREATE TABLE "public"."pending_vault_transactions"
(
  "tx_hash" text NOT NULL,
  "tx_type" text NOT NULL,
  "created_by" bigint NOT NULL,
  "chain_id" integer NOT NULL,
  "claim_id" bigint,
  "org_id" bigint,
  "distribution_id" bigint,
  "created_at" timestamp not null default now(),
  PRIMARY KEY ("tx_hash"),
  FOREIGN KEY ("tx_type") REFERENCES "public"."vault_tx_types"("value") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("org_id") REFERENCES "public"."protocols"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("distribution_id") REFERENCES "public"."distributions" ("id") on update restrict on delete restrict,
  UNIQUE ("tx_hash")
);
COMMENT ON TABLE "public"."pending_vault_transactions" IS E'stores app-specific context to aid in the recovery of incomplete transactions';

alter table "public"."distributions"
  add constraint "distributions_created_by_fkey"
  foreign key ("created_by")
  references "public"."profiles"
  ("id") on update restrict on delete restrict;

alter table distributions alter column total_amount type varchar;
update distributions set total_amount = replace(total_amount, '.0', '');
update distributions 
set distribution_json = (distribution_json #>> '{}')::jsonb;
alter table "public"."circles" add column "fixed_payment_vault_id" integer
 null;

alter table "public"."circles"
  add constraint "circles_fixed_payment_vault_id_fkey"
  foreign key ("fixed_payment_vault_id")
  references "public"."vaults"
  ("id") on update restrict on delete restrict;

CREATE TABLE "public"."interaction_events" (
  "user_id" integer NULL,
  "profile_id" integer NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NULL DEFAULT now(),
  "event_type" text NOT NULL,
  "event_subtype" text NULL,
  "data" jsonb NULL,
  "circle_id" integer NULL,
  "org_id" integer NULL,
  "id" serial NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TRIGGER "set_public_interaction_events_updated_at" BEFORE
UPDATE
  ON "public"."interaction_events"
  FOR EACH ROW
   EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"
   ();

COMMENT ON TRIGGER "set_public_interaction_events_updated_at" ON "public"."interaction_events"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
DROP TABLE IF EXISTS "public"."contributions";

CREATE TABLE "public"."contributions"
(
  "id" bigserial NOT NULL,
  "circle_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "description" text NOT NULL,
  "datetime_created" timestamptz NOT NULL DEFAULT now(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);

CREATE TRIGGER "set_public_contributions_updated_at" BEFORE
UPDATE
  ON "public"."contributions"
  FOR EACH ROW
   EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"
   ();

COMMENT ON TRIGGER "set_public_contributions_updated_at" ON "public"."contributions"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."interaction_events" drop column "user_id" cascade;

ALTER TABLE IF EXISTS "public"."protocols" RENAME TO "organizations";
ALTER INDEX IF EXISTS protocols_pkey RENAME TO organizations_pkey;
ALTER TRIGGER set_public_protocols_updated_at ON public.organizations RENAME TO set_public_organizations_updated_at;
ALTER SEQUENCE IF EXISTS public.protocols_id_seq RENAME TO organizations_id_seq;
ALTER TABLE IF EXISTS public.circles RENAME CONSTRAINT circles_protocol_id_fkey TO circles_organization_id_fkey;
ALTER TABLE IF EXISTS public.circles RENAME protocol_id TO organization_id;

DROP TABLE IF EXISTS "public"."migrations";
DROP TABLE IF EXISTS "public"."jobs";
DROP TABLE IF EXISTS "public"."failed_jobs";
DROP TABLE IF EXISTS "public"."feedbacks";

DROP SEQUENCE IF EXISTS "public".migrations_id_seq;
DROP SEQUENCE IF EXISTS "public".failed_jobs_id_seq;
DROP SEQUENCE IF EXISTS "public".jobs_id_seqs;
DROP SEQUENCE IF EXISTS "public".feedbacks_id_seqs;

alter table "public"."users" add column "entrance" varchar
null;

alter table "public"."organizations" add column "sandbox" boolean
 not null default 'false';
comment on column "public"."organizations"."sandbox" is E'Indicates a test/sample/sandbox org';
alter table "public"."profiles" add column "name" varchar
 null unique;


alter table "public"."circle_api_keys" add column "read_contributions" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "create_contributions" boolean
 not null default 'false';

alter table "public"."contributions" add column "created_with_api_key_hash" text
 null;

alter table "public"."contributions"
  add constraint "contributions_created_with_api_key_hash_fkey"
  foreign key ("created_with_api_key_hash")
  references "public"."circle_api_keys"
  ("hash") on update restrict on delete no action;

alter table "public"."organizations" add column "created_by" integer
 null;

alter table "public"."organizations"
  add constraint "organizations_created_by_fkey"
  foreign key ("created_by")
  references "public"."profiles"
  ("id") on update restrict on delete restrict;

CREATE TABLE "public"."member_epoch_pgives" 
("id" serial NOT NULL, 
"epoch_id" integer NOT NULL, 
"user_id" integer NOT NULL, 
"pgive" numeric NOT NULL DEFAULT 0, 
"normalized_pgive" numeric NOT NULL DEFAULT 0, 
"gives_received" integer NOT NULL DEFAULT 0, 
"opt_out_bonus" numeric NOT NULL DEFAULT 0, 
"created_at" timestamptz NOT NULL DEFAULT now(), 

PRIMARY KEY ("id") , 
FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE restrict ON DELETE restrict, 
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, 
UNIQUE ("id"), UNIQUE ("user_id", "epoch_id"));
COMMENT ON TABLE "public"."member_epoch_pgives" IS E'member allocated pgives per epoch';

alter table "public"."epoches" add column "description" text 
null;

alter table "public"."circles" add column "show_pending_gives" boolean
 not null default 'true';

CREATE TABLE "public"."epoch_pgive_data" 
("id" serial NOT NULL, 
"pgive" numeric NOT NULL DEFAULT 0, 
"gives_receiver_base" numeric NOT NULL DEFAULT 0, 
"active_months_bonus" numeric NOT NULL DEFAULT 0, 
"notes_bonus" numeric NOT NULL DEFAULT 0, 
"epoch_id" integer NOT NULL, 
"active_months" integer NOT NULL DEFAULT 0, 
"created_at" timestamptz NOT NULL DEFAULT now(), 
PRIMARY KEY ("id") , 
FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE restrict ON DELETE restrict, 
UNIQUE ("id"), 
UNIQUE ("epoch_id"));

alter table "public"."organizations" rename column "sandbox" to "sample";

CREATE EXTENSION IF NOT EXISTS citext;

ALTER TABLE "public"."profiles" ALTER COLUMN "name" TYPE citext;

CREATE TABLE "public"."locked_token_distributions" (
  "id" bigserial NOT NULL, 
  "epoch_id" bigint NOT NULL, 
  "gift_amount" numeric NOT NULL, 
  "tx_hash" varchar, 
  "distribution_json" jsonb NOT NULL, 
  "distributed_by" bigint NOT NULL, 
  PRIMARY KEY ("id") , 
  FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") 
    ON UPDATE restrict ON DELETE restrict, 
  FOREIGN KEY ("distributed_by") REFERENCES "public"."profiles"  ("id") 
    ON UPDATE restrict ON DELETE restrict
);

alter table "public"."nominees" alter column "name" drop not null;

CREATE TABLE "discord"."circle_api_tokens" (
  "id" bigserial NOT NULL,
  "token" text,
  "channel_snowflake" text NOT NULL,
  "circle_id" bigint NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("token"),
  UNIQUE ("circle_id"),
  UNIQUE ("id")
);
COMMENT ON TABLE "discord"."circle_api_tokens" IS E'tokens the discord bot uses to operate on circles';

alter table "public"."epoches" add column "repeat_data" jsonb
 null;

alter table "discord"."roles_circles" rename column "role" to "server_role";

alter table profiles drop column ann_power;
CREATE TABLE "public"."locked_token_distribution_gifts" (
  "id" bigserial NOT NULL, 
  "locked_token_distribution_id" bigint NOT NULL, 
  "profile_id" bigint NOT NULL, 
  "earnings" numeric NOT NULL,
  PRIMARY KEY ("id") , 
  FOREIGN KEY ("locked_token_distribution_id") REFERENCES "public"."locked_token_distributions"("id") ON UPDATE cascade ON DELETE cascade, 
  FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade);
alter table "public"."locked_token_distributions" drop column "distribution_json" cascade;
alter table "public"."locked_token_distributions" add column "chain_id" integer not null default 1;
alter table "public"."locked_token_distributions" add column "token_contract_address" varchar null;
alter table "public"."locked_token_distributions" add column "token_symbol" varchar null;
alter table "public"."locked_token_distributions" add column "token_decimals" integer not null default 18;
alter table profiles add column connector varchar;
alter table "public"."circles" rename column "team_sel_text" to "cont_help_text";

alter table "public"."nominees" drop column "name" cascade;


alter table "discord"."roles_circles" rename column "server_role" to "discord_role_id";

alter table "discord"."roles_circles" add column "discord_channel_id" text
 not null;

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

-- profiles
DO $$
BEGIN
  CREATE TRIGGER "set_public_profiles_updated_at"
    BEFORE UPDATE ON "public"."profiles"
  FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_profiles_updated_at" ON "public"."profiles"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object
      THEN RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;

-- distributions
DO $$
BEGIN
  CREATE TRIGGER "set_public_distributions_updated_at"
    BEFORE UPDATE ON "public"."distributions"
  FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
    COMMENT ON TRIGGER "set_public_distributions_updated_at" ON "public"."distributions"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
EXCEPTION
    WHEN duplicate_object
      THEN RAISE NOTICE 'updated_at trigger already exists. Ignoring...';
END$$;


alter table "public"."circles" add column "guild_id" integer
 null;

alter table "public"."circles" add column "guild_role_id" integer
 null;

alter table "public"."epoches" add constraint "description_length_constraint" check (length(description) >= 1 AND length(description) <= 100);

CREATE TABLE "public"."activities" (
    "id" bigserial NOT NULL,
    "circle_id" bigint,
    "organization_id" bigint NOT NULL,
    "actor_profile_id" bigint,
    "target_profile_id" bigint,
    "contribution_id" bigint,
    "epoch_id" bigint,
    "user_id" bigint,

    "action" varchar(100) NOT NULL,

    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY ("id") ,
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON UPDATE CASCADE ON DELETE CASCADE,

  FOREIGN KEY ("actor_profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE,

  FOREIGN KEY ("contribution_id") REFERENCES "public"."contributions"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE,

  CONSTRAINT "enforce_foreign_key_exists"
    CHECK (
      circle_id IS NOT NULL OR
      target_profile_id IS NOT NULL OR
      epoch_id IS NOT NULL OR
      contribution_id IS NOT NULL OR
      user_id IS NOT NULL
    )
);


CREATE INDEX activities_index_id_circle_id ON "public"."activities" ("id", "circle_id");

COMMENT ON TABLE "public"."activities" IS E'Table containing activity on our platform';

CREATE TRIGGER "set_public_activities_updated_at"
BEFORE UPDATE ON "public"."activities"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();


BEGIN;
-- Convert epoch repeat data from one format to another.

-- For all "weekly" repeating epoches, these are represented as "repeat: 1" in the old schema. In the new schema, these are represented as "
-- {
--  "type": "custom",
--  "frequency": 1,
--  "frequency_unit": "weeks"
--  "duration": <days column>
--  "duration_unit": "days"
--  "time_zone": "UTC"
-- }

UPDATE "public"."epoches" SET repeat_data = jsonb_build_object(
  'type',           'custom',
  'frequency',      1,
  'frequency_unit', 'weeks',
  'duration',       days,
  'duration_unit',  'days',
  'time_zone',      'UTC'
)
WHERE repeat = 1 and ended = false;

-- For all "monthly" repeating epoches, these are represented as "repeat: 2" in the old schema. In the new schema, these are represented as "
-- {
--  "type": "custom",
--  "frequency": 1,
--  "frequency_unit": "months"
--  "duration": <days column>
--  "duration_unit": "days"
--  "time_zone": "UTC"
-- }
UPDATE "public"."epoches" SET repeat_data = jsonb_build_object(
  'type',           'custom',
  'frequency',      1,
  'frequency_unit', 'months',
  'duration',       days,
  'duration_unit',  'days',
  'time_zone',      'UTC'
)
WHERE repeat = 2 and ended = false;

COMMIT;

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

alter table "discord"."roles_circles" add column "alerts" jsonb
 not null default '{}';

alter table "public"."circle_api_keys" add column "manage_users" boolean
 not null default 'false';

alter table "public"."profiles" alter column "name" set not null;

alter table "public"."epoches" add column "created_by" integer null;

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

alter table "public"."users" drop column "name" cascade;

DROP TRIGGER "users_insert_trigger" ON "public"."users";

DROP INDEX IF EXISTS "public"."activities_index_created_at";

CREATE TABLE "public"."reactions" ("id" bigserial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "activity_id" integer NOT NULL, "profile_id" integer NOT NULL, "reaction" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_reactions_updated_at"
BEFORE UPDATE ON "public"."reactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_reactions_updated_at" ON "public"."reactions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE  INDEX "reactions_index_profile_id" on
  "public"."reactions" using btree ("profile_id");


CREATE  INDEX "reactions_index_activity_id" on
  "public"."reactions" using btree ("activity_id");

ALTER TABLE "public"."reactions"
ADD CONSTRAINT "reactions_profile_id_activity_id_reaction_key" UNIQUE ("profile_id", "activity_id", "reaction");

CREATE TRIGGER "set_public_org_members_updated_at"
BEFORE UPDATE ON "public"."org_members"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
