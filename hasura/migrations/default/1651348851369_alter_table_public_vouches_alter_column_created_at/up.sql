update "public"."vouches" set created_at='2000-01-01' where created_at is null;
alter table "public"."vouches" alter column "created_at" set not null;
