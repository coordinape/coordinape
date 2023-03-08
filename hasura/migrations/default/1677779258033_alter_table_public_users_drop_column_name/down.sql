comment on column "public"."users"."name" is E'Members of a circle';
alter table "public"."users" alter column "name" drop not null;
alter table "public"."users" add column "name" varchar;
