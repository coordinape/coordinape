CREATE TRIGGER "set_public_profiles_updated_at"
BEFORE UPDATE ON "public"."profiles"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_profiles_updated_at" ON "public"."profiles"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
