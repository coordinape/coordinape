update "public"."profiles" set avatar = CONCAT('assets/static/avatars/',avatar)
where avatar not ilike 'assets/static/avatars/%' and avatar is not null;
