alter table "public"."epoches" add constraint "description_length_constraint" check (length(description) >= 1 AND length(description) <= 100);
