
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."reputation_scores" add column "github_score" integer
--  not null default '0';

alter table "public"."github_account" alter column "installation_token" set not null;

DROP TABLE "public"."github_account";
