comment on column "public"."cosouls"."profile_id" is E'local db copy of last synced on-chain cosoul data';
alter table "public"."cosouls" add constraint "cosouls_profile_id_key" unique (profile_id);
alter table "public"."cosouls" alter column "profile_id" drop not null;
alter table "public"."cosouls" add column "profile_id" int4;
