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
