
alter table "public"."notifications" drop constraint "notifications_check";
alter table "public"."notifications" add constraint "notifications_check" check (CHECK (reply_id IS NOT NULL OR invite_joined_id IS NOT NULL OR link_tx_hash IS NOT NULL));

alter table "public"."notifications" drop constraint "notifications_reaction_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notifications" add column "reaction_id" int8
--  null;

DROP INDEX IF EXISTS "public"."idx_notifications_profile_id";

alter table "public"."profiles" drop column "last_read_notification_id";

DROP TABLE "public"."notifications";
