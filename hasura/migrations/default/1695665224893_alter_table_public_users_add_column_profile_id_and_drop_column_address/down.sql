alter table "public"."users" drop column "profile_id";
alter table "public"."users" drop constraint "users_profile_id_circle_id_deleted_at_key";
alter table "public"."users" drop constraint "users_profile_id_fkey";
alter table "public"."users"
add constraint "users_address_fkey" foreign key ("address") references "public"."profiles" ("address") on update restrict on delete restrict;
alter table "public"."users"
add constraint "users_address_deleted_at_circle_id_key" unique ("address", "deleted_at", "circle_id");
CREATE INDEX "users_address_circle_id_deleted_at_key" on "public"."users" using btree ("address", "circle_id", "deleted_at");
alter table "public"."users" add column "address" varchar;
