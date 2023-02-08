BEGIN;
-- Undo the migration by resetting the repeat_data to NULL

UPDATE "public"."epoches" SET repeat_data = NULL
WHERE repeat = 1;

UPDATE "public"."epoches" SET repeat_data = NULL
WHERE repeat = 2;

COMMIT;
