
alter table "public"."claims" drop column "flag" cascade;

alter table "public"."claims" add column "claimed" boolean
 not null default 'false';

alter table "public"."claims" add column "created_at" timestamptz
 not null default now();

alter table "public"."claims" add column "created_by" int8
 not null;

alter table "public"."claims" add column "updated_at" timestamptz
 not null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_claims_updated_at"
BEFORE UPDATE ON "public"."claims"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_claims_updated_at" ON "public"."claims" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."claims" add column "updated_by" int8
 not null;

alter table "public"."claims"
  add constraint "claims_created_by_fkey"
  foreign key ("created_by")
  references "public"."users"
  ("id") on update no action on delete no action;

alter table "public"."claims"
  add constraint "claims_updated_by_fkey"
  foreign key ("updated_by")
  references "public"."users"
  ("id") on update no action on delete no action;
