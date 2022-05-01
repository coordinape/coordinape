update "public"."teammates" set updated_at='2020-12-01' where updated_at is null;
alter table "public"."users" alter column "updated_at" set not null;
