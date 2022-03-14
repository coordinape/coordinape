
CREATE TABLE "public"."circle_integrations" ("id" bigserial NOT NULL, "circle_id" bigint NOT NULL, "name" text NOT NULL, "type" text NOT NULL, "data" json NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON
DELETE restrict, UNIQUE ("id")
);

CREATE TABLE "public"."vaults"
(
  "id" bigserial NOT NULL,
  "token_address" varchar,
  "simple_token_address" varchar,
  "type" integer NOT NULL,
  "vault_address" varchar,
  "org_id" bigint NOT NULL,
  "decimals" integer NOT NULL,
  "owner_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "created_at" timestamp
  without time zone,
  "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
  ("id") ,
  FOREIGN KEY
  ("org_id") REFERENCES "public"."protocols"
  ("id") ON
  UPDATE no action ON
  DELETE no action,
  FOREIGN KEY
  ("created_by") REFERENCES "public"."users"
  ("id") ON
  UPDATE no action ON
  DELETE no action,
  UNIQUE
  ("id")
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
    "created_at" timestamp
    without time zone,
  "updated_at" timestamp without time zone DEFAULT now
    (),
  PRIMARY KEY
    ("id") ,
  FOREIGN KEY
    ("vault_id") REFERENCES "public"."vaults"
    ("id") ON
    UPDATE no action ON
    DELETE no action,
  FOREIGN KEY
    ("created_by") REFERENCES "public"."users"
    ("id") ON
    UPDATE no action ON
    DELETE no action,
  UNIQUE
    ("id")
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
      "id" bigserial NOT NULL,
      "epoch_id" bigint NOT NULL,
      "merkle_root" varchar NOT NULL,
      "total_amount" bigint NOT NULL,
      "vault_id" bigint NOT NULL,
      "created_by" bigint NOT NULL,
      "created_at" timestamp
      without time zone NOT NULL DEFAULT now
      (),
  "updated_at" timestamp  without time zone NOT NULL DEFAULT now
      (),
  PRIMARY KEY
      ("id") ,
  FOREIGN KEY
      ("epoch_id") REFERENCES "public"."epoches"
      ("id") ON
      UPDATE no action ON
      DELETE no action,
  FOREIGN KEY
      ("created_by") REFERENCES "public"."users"
      ("id") ON
      UPDATE no action ON
      DELETE no action,
  FOREIGN KEY
      ("vault_id") REFERENCES "public"."vaults"
      ("id") ON
      UPDATE no action ON
      DELETE no action,
  UNIQUE
      ("id")
);

      CREATE TABLE "public"."claims"
      (
        "id" bigserial NOT NULL,
        "distribution_id" bigint NOT NULL,
        "index" bigint NOT NULL,
        "proof" varchar NOT NULL,
        "address" varchar NOT NULL,
        "flag" boolean NOT NULL,
        "claimed" boolean NOT NULL,
        "amount" bigint NOT NULL,
        "user_id" bigint NOT NULL,
        "created_by" bigint NOT NULL,
        "created_at" timestamp
        without time zone NOT NULL DEFAULT now
        (),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now
        (),
  PRIMARY KEY
        ("id") ,
  FOREIGN KEY
        ("distribution_id") REFERENCES "public"."distributions"
        ("id") ON
        UPDATE no action ON
        DELETE no action,
  FOREIGN KEY
        ("user_id") REFERENCES "public"."users"
        ("id") ON
        UPDATE no action ON
        DELETE no action,
  UNIQUE
        ("id")
);

        alter table "public"."vaults" add column "symbol" varchar
 not null;

        alter table "public"."vaults" drop column "type"
        cascade;
