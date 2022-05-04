update "public"."profiles" set updated_at='2000-01-01' where updated_at is null;
alter table "public"."profiles" alter column "updated_at" set not null;
