CREATE TRIGGER "set_public_org_members_updated_at"
BEFORE UPDATE ON "public"."org_members"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
