alter table "public"."reputation_scores" add column "created_at" timestamptz
 null default now();
