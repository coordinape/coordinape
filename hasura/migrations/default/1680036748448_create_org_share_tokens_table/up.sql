CREATE TABLE "public"."org_share_tokens" (
  "org_id" bigint NOT NULL,
  "type" integer NOT NULL,
  "uuid" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("org_id","type"), UNIQUE ("uuid"),
  FOREIGN KEY ("org_id") REFERENCES "public"."organizations"
  ("id") on update restrict on delete restrict
);
CREATE TRIGGER "set_public_org_share_tokens_updated_at"
BEFORE UPDATE ON "public"."org_share_tokens"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_org_share_tokens_updated_at" ON "public"."org_share_tokens" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
