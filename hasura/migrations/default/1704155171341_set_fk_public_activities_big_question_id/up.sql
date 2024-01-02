alter table "public"."activities"
  add constraint "activities_big_question_id_fkey"
  foreign key ("big_question_id")
  references "public"."big_questions"
  ("id") on update cascade on delete cascade;
