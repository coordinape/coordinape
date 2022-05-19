update "public"."profiles" set background = CONCAT('assets/static/images/',background)
where background not like 'assets/static/images/%' and background is not null;
