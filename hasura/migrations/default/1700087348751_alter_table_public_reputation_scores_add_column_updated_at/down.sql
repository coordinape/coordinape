alter table "public"."reputation_scores" drop column "updated_at";

DROP TRIGGER IF EXISTS "set_public_reputation_scores_updated_at" ON "public"."reputation_scores";
