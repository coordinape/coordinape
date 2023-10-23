CREATE TABLE "public"."poap_events" (
    "id" bigserial NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "fancy_id" text NOT NULL,
    "name" text NOT NULL,
    "event_url" text NOT NULL,
    "image_url" text NOT NULL,
    "country" text NOT NULL,
    "city" text NOT NULL,
    "description" text NOT NULL,
    "year" integer NOT NULL,
    "start_date" date NOT NULL,
    "end_date" date NOT NULL,
    "expiry_date" date NOT NULL,
    "supply" integer NOT NULL,
    PRIMARY KEY ("id")
);

COMMENT ON TABLE "public"."poap_events" IS E'Poap event info';


CREATE TRIGGER "set_public_poap_events_updated_at"
BEFORE UPDATE ON "public"."poap_events"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_poap_events_updated_at" ON "public"."poap_events"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
