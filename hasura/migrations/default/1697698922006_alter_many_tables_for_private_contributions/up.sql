
alter table "public"."contributions" add column "private_stream" boolean
 not null default 'false';

alter table "public"."activities" alter column "organization_id" drop not null;

alter table "public"."activities" add column "private_stream" boolean
 null default 'false';

alter table "public"."activities" alter column "private_stream" set not null;

alter table "public"."contributions" alter column "circle_id" drop not null;

alter table "public"."contributions" add column "profile_id" int8
 null;

UPDATE contributions
SET profile_id = users.profile_id
FROM users
WHERE contributions.user_id = users.id;

alter table "public"."contributions" alter column "profile_id" set not null;

alter table "public"."contributions" add constraint "chk_circle_user" check (((circle_id IS NULL) OR (circle_id IS NOT NULL AND user_id IS NOT NULL)));

alter table "public"."contributions" alter column "user_id" drop not null;
