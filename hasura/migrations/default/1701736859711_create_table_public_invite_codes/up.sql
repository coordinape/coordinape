CREATE TABLE
  "public"."invite_codes" (
    "code" citext NOT NULL,
    "inviter_id" bigint NOT NULL,
    "invited_id" bigint NULL,
    "created_at" timestamptz NOT NULL DEFAULT now (),
    "updated_at" timestamptz NOT NULL DEFAULT now (),
    PRIMARY KEY ("code"),
    FOREIGN KEY ("inviter_id") REFERENCES "public"."profiles" ("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("invited_id") REFERENCES "public"."profiles" ("id") ON UPDATE cascade ON DELETE cascade,
    UNIQUE ("code"),
    UNIQUE ("invited_id")
  );

COMMENT ON TABLE "public"."invite_codes" IS E'Invite codes table for restricting access to app';

CREATE TRIGGER "set_public_invite_codes_updated_at" BEFORE
UPDATE ON "public"."invite_codes" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at" ();

COMMENT ON TRIGGER "set_public_invite_codes_updated_at" ON "public"."invite_codes" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
