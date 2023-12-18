alter table "public"."notifications" add column "mention" boolean
 not null default 'false';
