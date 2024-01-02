CREATE UNIQUE INDEX unique_contribution_per_big_question
ON contributions (big_question_id, profile_id)
WHERE deleted_at IS NULL;
