CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."profiles" add column "invite_code" uuid
 not null unique default gen_random_uuid();

alter table "public"."profiles" add column "invited_by" bigint
 null;
