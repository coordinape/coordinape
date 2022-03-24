
alter table "public"."distributions" drop column "total_amount" cascade;

alter table "public"."distributions" add column "total_amount" numeric
 not null;

alter table "public"."distributions" drop column "updated_at" cascade;
