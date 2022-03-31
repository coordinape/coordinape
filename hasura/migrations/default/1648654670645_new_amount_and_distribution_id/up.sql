
alter table "public"."claims" add column "new_amount" numeric
 not null default '0';

alter table "public"."distributions" add column "distribution_json" jsonb
 not null default '{}';

alter table "public"."distributions" add column "distribution_epoch_id" bigint
 null;
