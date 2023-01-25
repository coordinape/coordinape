BEGIN;
-- Convert epoch repeat data from one format to another.

-- For all "weekly" repeating epoches, these are represented as "repeat: 1" in the old schema. In the new schema, these are represented as "
-- {
--  "frequency": 1,
--  "frequency_unit": "weeks"
-- }

UPDATE "public"."epoches" SET repeat_data = jsonb_build_object('frequency', 1, 'frequency_unit', 'weeks')
WHERE repeat = 1;

-- For all "monthly" repeating epoches, these are represented as "repeat: 2" in the old schema. In the new schema, these are represented as "
-- {
--  "frequency": 1,
--  "frequency_unit": "months"
-- }
UPDATE "public"."epoches" SET repeat_data = jsonb_build_object('frequency', 1, 'frequency_unit', 'months')
WHERE repeat = 2;

COMMIT;
