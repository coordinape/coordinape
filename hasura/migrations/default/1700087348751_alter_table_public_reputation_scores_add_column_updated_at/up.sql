alter table "public"."reputation_scores" add column "updated_at" timestamptz default now();

CREATE TRIGGER "set_public_reputation_scores_updated_at"
BEFORE UPDATE ON "public"."reputation_scores"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_reputation_scores_updated_at" ON "public"."reputation_scores"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
