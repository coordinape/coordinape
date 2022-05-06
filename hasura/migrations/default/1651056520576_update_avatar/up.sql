update "public"."profiles" set avatar = CONCAT('assets/static/images/',avatar)
where avatar not like 'assets/static/images/%' and avatar is not null;
