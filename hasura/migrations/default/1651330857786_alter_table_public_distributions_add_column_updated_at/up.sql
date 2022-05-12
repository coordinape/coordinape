alter table "public"."distributions" add column "updated_at" timestamp
 not null default now();
