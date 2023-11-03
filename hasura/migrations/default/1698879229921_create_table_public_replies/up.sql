CREATE TABLE
  "public"."replies" (
    "id" bigserial NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now (),
    "updated_at" timestamptz NOT NULL DEFAULT now (),
    "activity_id" integer NOT NULL,
    "profile_id" integer NOT NULL,
    "reply" text NOT NULL,
    "activity_actor_id" integer NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("activity_id") REFERENCES "public"."activities" ("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON UPDATE cascade ON DELETE cascade,
    UNIQUE ("id")
  );

CREATE INDEX replies_index_activity_id ON "public"."replies" USING btree ("activity_id");
CREATE INDEX replies_index_profile_id ON "public"."replies" USING btree ("profile_id");
CREATE INDEX replies_index_activity_actor_id ON "public"."replies" USING btree ("activity_actor_id");
CREATE INDEX replies_index_created_at ON "public"."replies" USING btree ("created_at");

COMMENT ON TABLE "public"."replies" IS E'Replies to activity items';

CREATE TRIGGER "set_public_replies_updated_at" BEFORE
UPDATE ON "public"."replies" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at" ();

COMMENT ON TRIGGER "set_public_replies_updated_at" ON "public"."replies" IS E'trigger to set value of column "updated_at" to current timestamp on row update';
