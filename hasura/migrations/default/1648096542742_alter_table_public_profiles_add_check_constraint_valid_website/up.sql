update "public"."profiles" set website = CONCAT('https://',website) where website not ilike 'https://%' and website not ilike 'http://%' and website is not null;
-- update these three specific users, making sure they have these y.at addresses
update "public"."profiles" set website = RTRIM(website) where website is not null;
update "public"."profiles" set website='https://y.at/mountain.crown.mountain' where id=7056 AND website ilike 'https://y.at%';
update "public"."profiles" set website='https://y.at/fox.rocket.rainbow' where id=3117 AND website ilike 'https://y.at%';
update "public"."profiles" set website='https://y.at/teacup.ocean.sparkles.half-moon' where id=566 AND website ilike 'https://y.at%';
update "public"."profiles" set website=NULL where id=706;
alter table "public"."profiles" add constraint "valid_website" check (website::text ~* 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,255}\.[a-z]{2,9}\y([-a-zA-Z0-9@:%_\+.,~#?!&>//=]*)$'::text OR website IS NULL);
