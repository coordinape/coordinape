update "public"."profiles" set website = CONCAT('https://',website) where website not ilike 'https://%' and website not ilike 'http://%' and website is not null;
-- update these three specific users, making sure they have these y.at addresses
update "public"."profiles" set website=null where id in(3117,7056,566) AND website ilike 'https://y.at%';
alter table "public"."profiles" add constraint "valid_website" check (website::text ~* 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,255}\.[a-z]{2,9}\y([-a-zA-Z0-9@:%_\+.,~#?!&>//=]*)$'::text);
