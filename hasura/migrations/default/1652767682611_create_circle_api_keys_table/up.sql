
CREATE TABLE "public"."circle_api_keys" ("hash" text NOT NULL, "circle_id" int8 NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "created_by" int8 NOT NULL, "name" text NOT NULL, PRIMARY KEY ("hash") , UNIQUE ("hash"));COMMENT ON TABLE "public"."circle_api_keys" IS E'Circle-scoped API keys with user defined permissions to allow third parties to authenticate to Coordinape\'s GraphQL API.';


alter table "public"."circle_api_keys" add column "read_circle" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "update_circle" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_nominees" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "create_vouches" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_pending_token_gifts" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "update_pending_token_gifts" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_member_profiles" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "read_epochs" boolean
 not null default 'false';

