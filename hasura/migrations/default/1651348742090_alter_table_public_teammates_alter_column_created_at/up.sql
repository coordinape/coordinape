update "public"."teammates" set created_at='2020-12-01' where created_at is null;
alter table "public"."teammates" alter column "created_at" set not null;
