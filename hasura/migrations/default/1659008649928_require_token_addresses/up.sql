
alter table "public"."vaults" alter column "simple_token_address" set not null;

alter table "public"."vaults" alter column "token_address" set not null;
