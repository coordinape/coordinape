alter table "public"."contributions" add column "private_stream" boolean
 not null default 'false';
