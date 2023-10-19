alter table "public"."contributions" add constraint "chk_circle_user" check (((circle_id IS NULL) OR (circle_id IS NOT NULL AND user_id IS NOT NULL)));
