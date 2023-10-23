CREATE TABLE
  "public"."poap_holders" (
    "id" bigserial NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now (),
    "updated_at" timestamptz NOT NULL DEFAULT now (),
    "token_id" bigint NOT NULL,
    "address" citext NOT NULL,
    "chain" text NOT NULL,
    "event_id" bigint NOT NULL,
    "poap_created" timestamptz NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("event_id") REFERENCES "public"."poap_events" ("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("address") REFERENCES "public"."profiles" ("address") ON UPDATE restrict ON DELETE restrict
  );

CREATE INDEX "poap_holders_event_id_index" on "public"."poap_holders" using btree ("event_id");

CREATE TRIGGER "set_public_poap_holders_updated_at" BEFORE
UPDATE ON "public"."poap_holders" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at" ();

COMMENT ON TRIGGER "set_public_poap_holders_updated_at" ON "public"."poap_holders" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
