update "public"."circles" set logo = CONCAT('assets/static/images/',logo)
where logo not like 'assets/static/images/%' and logo is not null;
