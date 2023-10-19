UPDATE contributions
SET profile_id = users.profile_id
FROM users
WHERE contributions.user_id = users.id;
