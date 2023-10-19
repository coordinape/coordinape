CREATE TRIGGER "set_key_holders_updated_at"
BEFORE UPDATE ON "public"."key_holders"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_key_holders_updated_at" ON "public"."key_holders"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
