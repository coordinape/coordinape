CREATE TABLE
  "public"."mutes" (
    "profile_id" bigint NOT NULL,
    "target_profile_id" bigint NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now (),
    PRIMARY KEY ("profile_id", "target_profile_id"),
    FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles" ("id") ON UPDATE cascade ON DELETE cascade,
    UNIQUE ("profile_id", "target_profile_id")
  );

COMMENT ON TABLE "public"."mutes" IS E'Table of one profile muting another profile';

CREATE TRIGGER "set_public_mutes_updated_at" BEFORE
UPDATE ON "public"."mutes" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at" ();

COMMENT ON TRIGGER "set_public_mutes_updated_at" ON "public"."mutes" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
