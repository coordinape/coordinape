-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."epoches" add column "pgive" numeric
--  not null default '0';

alter table "public"."epoches" drop column "pgive";

alter table "public"."epoches" drop column "gives_receiver_base";

alter table "public"."epoches" drop column "active_months_bonus";

alter table "public"."epoches" drop column "notes_bonus";

alter table "public"."epoches" drop column "processed";

