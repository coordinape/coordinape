alter table "public"."profiles"
  add constraint "profiles_last_emailed_big_question_id_fkey"
  foreign key ("last_emailed_big_question_id")
  references "public"."big_questions"
  ("id") on update cascade on delete cascade;
