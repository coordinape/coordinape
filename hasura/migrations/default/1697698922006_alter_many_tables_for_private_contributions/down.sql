
alter table "public"."contributions" alter column "user_id" set not null;

alter table "public"."contributions" drop constraint "chk_circle_user";

alter table "public"."contributions" drop column "profile_id";

alter table "public"."contributions" alter column "circle_id" set not null;

alter table "public"."activities" drop column "private_stream";

alter table "public"."activities" alter column "organization_id" set not null;

alter table "public"."contributions" drop column "private_stream";
