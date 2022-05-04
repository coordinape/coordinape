update "public"."profiles" set created_at='2000-01-01' where created_at is null;
alter table "public"."profiles" alter column "created_at" set not null;
