
alter table "public"."vaults" alter column "token_address" drop not null;

alter table "public"."vaults" alter column "simple_token_address" drop not null;
