CREATE EXTENSION IF NOT EXISTS vector;
alter table "public"."poap_events" add column "embedding" vector(1536) null;
