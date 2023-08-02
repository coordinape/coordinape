UPDATE cosouls
SET address = profiles.address
FROM profiles
WHERE cosouls.profile_id = profiles.id;
