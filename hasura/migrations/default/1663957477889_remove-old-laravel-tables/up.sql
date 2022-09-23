DROP TABLE IF EXISTS "public"."migrations";
DROP TABLE IF EXISTS "public"."jobs";
DROP TABLE IF EXISTS "public"."failed_jobs";
DROP TABLE IF EXISTS "public"."feedbacks";

DROP SEQUENCE IF EXISTS "public".migrations_id_seq;
DROP SEQUENCE IF EXISTS "public".failed_jobs_id_seq;
DROP SEQUENCE IF EXISTS "public".jobs_id_seqs;
DROP SEQUENCE IF EXISTS "public".feedbacks_id_seqs;
