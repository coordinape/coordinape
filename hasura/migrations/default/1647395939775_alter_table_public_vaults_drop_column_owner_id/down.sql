alter table "public"."vaults" alter column "owner_id" drop not null;
alter table "public"."vaults" add column "owner_id" int8;
