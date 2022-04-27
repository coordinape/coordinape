update "public"."circles" set logo = CONCAT('assets/static/images/',logo)
where logo not ilike 'assets/static/images/%' and logo is not null;
