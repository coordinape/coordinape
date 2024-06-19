DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'casts') THEN
    CREATE TABLE IF NOT EXISTS farcaster.casts (
      id bigint NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at timestamp without time zone,
      "timestamp" timestamp without time zone NOT NULL,
      fid bigint NOT NULL,
      hash bytea NOT NULL,
      parent_hash bytea,
      parent_fid bigint,
      parent_url text,
      text text NOT NULL,
      embeds jsonb DEFAULT '{}'::jsonb NOT NULL,
      mentions bigint[] DEFAULT '{}'::bigint[] NOT NULL,
      mentions_positions smallint[] DEFAULT '{}'::smallint[] NOT NULL,
      root_parent_hash bytea,
      root_parent_url text
    );
    ALTER TABLE farcaster.casts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
      SEQUENCE NAME farcaster.casts_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1
    );
    ALTER TABLE ONLY farcaster.casts
      ADD CONSTRAINT casts_hash_unique UNIQUE (hash);
    ALTER TABLE ONLY farcaster.casts
      ADD CONSTRAINT casts_pkey PRIMARY KEY (id);
    CREATE INDEX casts_created_at_idx ON farcaster.casts USING btree (created_at);
    CREATE INDEX casts_deleted_at_idx ON farcaster.casts USING btree (deleted_at);
    CREATE INDEX casts_fid_timestamp_index ON farcaster.casts USING btree (fid, "timestamp");
    CREATE INDEX casts_parent_hash_parent_fid_index ON farcaster.casts USING btree (parent_hash, parent_fid) WHERE ((parent_hash IS NOT NULL) AND (parent_fid IS NOT NULL));
    CREATE INDEX casts_parent_url_index ON farcaster.casts USING btree (parent_url) WHERE (parent_url IS NOT NULL);
    CREATE INDEX casts_timestamp_index ON farcaster.casts USING btree ("timestamp");
    CREATE INDEX casts_updated_at_idx ON farcaster.casts USING btree (updated_at);
    CREATE INDEX idx_hash ON farcaster.casts USING btree (hash);
    CREATE INDEX idx_parent_fid_timestamp ON farcaster.casts USING btree (parent_fid, "timestamp");
    CREATE INDEX idx_parent_hash ON farcaster.casts USING btree (parent_hash) WITH (deduplicate_items='false');
    CREATE INDEX idx_parent_url_deleted_at_timestamp ON farcaster.casts USING btree (parent_url, deleted_at, "timestamp" DESC);
    CREATE INDEX idx_root_parent_url ON farcaster.casts USING btree (root_parent_url);
    CREATE INDEX root_parent_hash_idx ON farcaster.casts USING btree (root_parent_hash);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'fids') THEN
    CREATE TABLE IF NOT EXISTS farcaster.fids (
      fid bigint NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      custody_address bytea NOT NULL,
      registered_at timestamp with time zone
    );
    ALTER TABLE ONLY farcaster.fids
      ADD CONSTRAINT fids_pkey PRIMARY KEY (fid);
    CREATE INDEX fids_created_at_idx ON farcaster.fids USING btree (created_at);
    CREATE INDEX fids_updated_at_idx ON farcaster.fids USING btree (updated_at);
    CREATE INDEX idx_fids_custody_address ON farcaster.fids USING btree (custody_address);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'fnames') THEN
    CREATE TABLE IF NOT EXISTS farcaster.fnames (
      fname text NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      custody_address bytea,
      expires_at timestamp without time zone,
      fid bigint,
      deleted_at timestamp without time zone
    );
    ALTER TABLE ONLY farcaster.fnames
      ADD CONSTRAINT fnames_pkey PRIMARY KEY (fname);
    CREATE INDEX fnames_created_at_idx ON farcaster.fnames USING btree (created_at);
    CREATE INDEX fnames_deleted_at_idx ON farcaster.fnames USING btree (deleted_at);
    CREATE INDEX fnames_expires_at_idx ON farcaster.fnames USING btree (expires_at);
    CREATE INDEX fnames_updated_at_idx ON farcaster.fnames USING btree (updated_at);
    CREATE INDEX idx_fnames_custody_address ON farcaster.fnames USING btree (custody_address);
    CREATE INDEX idx_fnames_fname ON farcaster.fnames USING btree (fname) INCLUDE (fname) WITH (deduplicate_items='true');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'links') THEN
    CREATE TABLE IF NOT EXISTS farcaster.links (
      id bigint NOT NULL,
      fid bigint,
      target_fid bigint,
      hash bytea NOT NULL,
      "timestamp" timestamp without time zone NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at timestamp without time zone,
      type text,
      display_timestamp timestamp without time zone
    );
    ALTER TABLE farcaster.links ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
      SEQUENCE NAME farcaster.links_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1
    );
    ALTER TABLE ONLY farcaster.links
      ADD CONSTRAINT links_fid_target_fid_type_unique UNIQUE (fid, target_fid, type);
    ALTER TABLE ONLY farcaster.links
      ADD CONSTRAINT links_hash_unique UNIQUE (hash);
    ALTER TABLE ONLY farcaster.links
      ADD CONSTRAINT links_pkey PRIMARY KEY (id);
    CREATE INDEX idx_links_fid ON farcaster.links USING btree (fid);
    CREATE INDEX idx_links_fid_type_target_fid_timestamp ON farcaster.links USING btree (fid, type, target_fid, "timestamp");
    CREATE INDEX idx_links_fid_type_timestamp ON farcaster.links USING btree (fid, type, "timestamp");
    CREATE INDEX idx_links_target_fid ON farcaster.links USING btree (target_fid);
    CREATE INDEX idx_links_target_fid_on_deleted_null ON farcaster.links USING btree (target_fid) WHERE (deleted_at IS NULL);
    CREATE INDEX idx_links_target_fid_type_timestamp ON farcaster.links USING btree (target_fid, type, "timestamp");
    CREATE INDEX links_created_at_idx ON farcaster.links USING btree (created_at);
    CREATE INDEX links_deleted_at_idx ON farcaster.links USING btree (deleted_at);
    CREATE INDEX links_updated_at_idx ON farcaster.links USING btree (updated_at);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'user_data') THEN
    CREATE TABLE IF NOT EXISTS farcaster.user_data (
      id bigint NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at timestamp without time zone,
      "timestamp" timestamp without time zone NOT NULL,
      fid bigint NOT NULL,
      hash bytea NOT NULL,
      type smallint NOT NULL,
      value text NOT NULL
    );
    ALTER TABLE farcaster.user_data ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
      SEQUENCE NAME farcaster.user_data_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1
    );
    ALTER TABLE ONLY farcaster.user_data
      ADD CONSTRAINT user_data_fid_type_unique UNIQUE (fid, type);
    ALTER TABLE ONLY farcaster.user_data
      ADD CONSTRAINT user_data_hash_unique UNIQUE (hash);
    ALTER TABLE ONLY farcaster.user_data
      ADD CONSTRAINT user_data_pkey PRIMARY KEY (id);
    CREATE INDEX idx_user_data_fid_type ON farcaster.user_data USING btree (fid, type) WITH (deduplicate_items='false');
    CREATE INDEX user_data_created_at_idx ON farcaster.user_data USING btree (created_at);
    CREATE INDEX user_data_deleted_at_idx ON farcaster.user_data USING btree (deleted_at);
    CREATE INDEX user_data_fid_index ON farcaster.user_data USING btree (fid);
    CREATE INDEX user_data_updated_at_idx ON farcaster.user_data USING btree (updated_at);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'verifications') THEN
    CREATE TABLE IF NOT EXISTS farcaster.verifications (
      id bigint NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at timestamp without time zone,
      "timestamp" timestamp without time zone NOT NULL,
      fid bigint NOT NULL,
      hash bytea NOT NULL,
      claim jsonb NOT NULL
    );
    ALTER TABLE farcaster.verifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
      SEQUENCE NAME farcaster.verifications_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1
    );
    ALTER TABLE ONLY farcaster.verifications
      ADD CONSTRAINT verifications_hash_unique UNIQUE (hash);
    ALTER TABLE ONLY farcaster.verifications
      ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);
    CREATE INDEX idx_verifications_fid ON farcaster.verifications USING btree (fid);
    CREATE INDEX verifications_claim_address_index ON farcaster.verifications USING btree (((claim ->> 'address'::text)));
    CREATE INDEX verifications_created_at_idx ON farcaster.verifications USING btree (created_at);
    CREATE INDEX verifications_deleted_at_idx ON farcaster.verifications USING btree (deleted_at);
    CREATE INDEX verifications_fid_timestamp_index ON farcaster.verifications USING btree (fid, "timestamp");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'reactions') THEN
    CREATE TABLE IF NOT EXISTS farcaster.reactions (
      id bigint NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at timestamp without time zone,
      "timestamp" timestamp without time zone NOT NULL,
      reaction_type smallint NOT NULL,
      fid bigint NOT NULL,
      hash bytea NOT NULL,
      target_hash bytea,
      target_fid bigint,
      target_url text
    );
    ALTER TABLE farcaster.reactions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
      SEQUENCE NAME farcaster.reactions_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1
    );
    ALTER TABLE ONLY farcaster.reactions
      ADD CONSTRAINT reactions_hash_unique UNIQUE (hash);
    ALTER TABLE ONLY farcaster.reactions
      ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);
    CREATE INDEX reactions_created_at_idx ON farcaster.reactions USING btree (created_at);
    CREATE INDEX reactions_fid_timestamp_index ON farcaster.reactions USING btree (fid, "timestamp");
    CREATE INDEX reactions_target_hash_target_fid_index ON farcaster.reactions USING btree (target_hash, target_fid) WHERE ((target_hash IS NOT NULL) AND (target_fid IS NOT NULL));
    CREATE INDEX reactions_target_url_index ON farcaster.reactions USING btree (target_url) WHERE (target_url IS NOT NULL);
    CREATE INDEX reactions_updated_at_idx ON farcaster.reactions USING btree (updated_at);
    CREATE INDEX idx_reactions_target_fid_timestamp ON farcaster.reactions USING btree (target_fid, "timestamp");
    CREATE INDEX idx_reactions_target_hash_deleted_at_timestamp ON farcaster.reactions USING btree (target_hash, deleted_at, "timestamp" DESC) WITH (deduplicate_items='false');
    CREATE INDEX idx_reactions_type_deleted_at ON farcaster.reactions USING btree (reaction_type, deleted_at);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'signers') THEN
    CREATE TABLE IF NOT EXISTS farcaster.signers (
      id bigint NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at timestamp without time zone,
      "timestamp" timestamp without time zone NOT NULL,
      fid bigint NOT NULL,
      hash bytea,
      custody_address bytea,
      signer bytea NOT NULL,
      name text,
      app_fid bigint
    );
    ALTER TABLE farcaster.signers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
      SEQUENCE NAME farcaster.signers_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1
    );
    ALTER TABLE ONLY farcaster.signers
      ADD CONSTRAINT signers_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY farcaster.signers
      ADD CONSTRAINT unique_timestamp_fid_signer UNIQUE ("timestamp", fid, signer);
    CREATE INDEX signers_created_at_idx ON farcaster.signers USING btree (created_at);
    CREATE INDEX signers_deleted_at_idx ON farcaster.signers USING btree (deleted_at);
    CREATE INDEX signers_fid_timestamp_index ON farcaster.signers USING btree (fid, "timestamp");
    CREATE INDEX signers_updated_at_idx ON farcaster.signers USING btree (updated_at);
    CREATE INDEX idx_signers_deleted_at_null ON farcaster.signers USING btree (deleted_at) WHERE (deleted_at IS NULL);
    CREATE INDEX idx_signers_signer ON farcaster.signers USING btree (signer);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'storage') THEN
    CREATE TABLE IF NOT EXISTS farcaster.storage (
      id bigint NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at timestamp without time zone,
      "timestamp" timestamp without time zone NOT NULL,
      fid bigint NOT NULL,
      units bigint NOT NULL,
      expiry timestamp without time zone NOT NULL
    );
    ALTER TABLE farcaster.storage ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
      SEQUENCE NAME farcaster.storage_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1
    );
    ALTER TABLE ONLY farcaster.storage
      ADD CONSTRAINT storage_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY farcaster.storage
      ADD CONSTRAINT unique_fid_units_expiry UNIQUE (fid, units, expiry);
    CREATE INDEX storage_created_at_idx ON farcaster.storage USING btree (created_at);
    CREATE INDEX storage_deleted_at_idx ON farcaster.storage USING btree (deleted_at);
    CREATE INDEX storage_updated_at_idx ON farcaster.storage USING btree (updated_at);
    CREATE INDEX idx_storage_fid_units_expiry_id ON farcaster.storage USING btree (fid, units, expiry, id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'farcaster' AND table_name = 'warpcast_power_users') THEN
    CREATE TABLE IF NOT EXISTS farcaster.warpcast_power_users (
      fid bigint NOT NULL,
      created_at timestamp without time zone NOT NULL,
      updated_at timestamp without time zone NOT NULL,
      deleted_at timestamp without time zone
    );
    ALTER TABLE ONLY farcaster.warpcast_power_users
      ADD CONSTRAINT warpcast_power_users_pkey PRIMARY KEY (fid);
  END IF;
END $$;

CREATE OR REPLACE VIEW farcaster.profile_with_addresses AS
SELECT main.fid,
    COALESCE(NULLIF(main.fname, ''::text), main.fname_noproof) AS fname,
    main.display_name,
    main.avatar_url,
    main.bio,
    COALESCE(addr.addresses, '[]'::jsonb) AS verified_addresses,
    GREATEST(main.max_updated_at, COALESCE(addr.max_updated_at, '1970-01-01 00:00:00'::timestamp without time zone)) AS updated_at
FROM (
    SELECT f.fid,
           fn.fname AS fname_noproof,
           encode(f.custody_address, 'hex'::text) AS custody_address_hex,
           max(CASE WHEN ud.type = 6 THEN ud.value ELSE NULL::text END) AS fname,
           max(CASE WHEN ud.type = 2 THEN ud.value ELSE NULL::text END) AS display_name,
           max(CASE WHEN ud.type = 1 THEN ud.value ELSE NULL::text END) AS avatar_url,
           max(CASE WHEN ud.type = 3 THEN ud.value ELSE NULL::text END) AS bio,
           GREATEST(max(f.updated_at), max(fn.updated_at), max(ud.updated_at)) AS max_updated_at
    FROM farcaster.fids f
    LEFT JOIN farcaster.fnames fn ON f.custody_address = fn.custody_address
    LEFT JOIN farcaster.user_data ud ON f.fid = ud.fid
    GROUP BY f.fid, fn.fname, f.custody_address
) main
LEFT JOIN (
    SELECT verifications.fid,
           jsonb_agg((verifications.claim ->> 'address'::text) ORDER BY verifications."timestamp") AS addresses,
           max(verifications.updated_at) AS max_updated_at
    FROM farcaster.verifications verifications
    GROUP BY verifications.fid
) addr ON main.fid = addr.fid;
