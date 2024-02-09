alter table "public"."profiles" add column "points_checkpointed_at" timestamptz
 not null default now();
