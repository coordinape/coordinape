CREATE UNIQUE INDEX "unique_contribution_per_big_question" on
  "public"."contributions" using btree ("big_question_id", "profile_id");
