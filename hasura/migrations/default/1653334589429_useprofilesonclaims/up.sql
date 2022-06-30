
alter table "public"."claims" add column "profile_id" bigint
 not null;

alter table "public"."claims" drop column "user_id" cascade;
