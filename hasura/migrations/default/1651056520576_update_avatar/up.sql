update "public"."profiles" set avatar = CONCAT('assets/static/images/',avatar)
where avatar not ilike 'assets/static/images/%' and avatar is not null;
