
BEGIN;
-- Convert epoch repeat data from one format to another.

-- For all "weekly" repeating epoches, these are represented as "repeat: 1" in the old schema. In the new schema, these are represented as "
-- {
--  "type": "custom",
--  "frequency": 1,
--  "frequency_unit": "weeks"
--  "duration": <days column>
--  "duration_unit": "days"
--  "time_zone": "UTC"
-- }

UPDATE "public"."epoches" SET repeat_data = jsonb_build_object(
  'type',           'custom',
  'frequency',      1,
  'frequency_unit', 'weeks',
  'duration',       days,
  'duration_unit',  'days',
  'time_zone',      'UTC'
)
WHERE repeat = 1 and ended = false;

-- For all "monthly" repeating epoches, these are represented as "repeat: 2" in the old schema. In the new schema, these are represented as "
-- {
--  "type": "custom",
--  "frequency": 1,
--  "frequency_unit": "months"
--  "duration": <days column>
--  "duration_unit": "days"
--  "time_zone": "UTC"
-- }
UPDATE "public"."epoches" SET repeat_data = jsonb_build_object(
  'type',           'custom',
  'frequency',      1,
  'frequency_unit', 'months',
  'duration',       days,
  'duration_unit',  'days',
  'time_zone',      'UTC'
)
WHERE repeat = 2 and ended = false;

COMMIT;
