
alter table "public"."contributions" drop constraint "contributions_created_with_api_key_hash_fkey";

alter table "public"."contributions" drop column "created_with_api_key_hash";

alter table "public"."circle_api_keys" drop column "create_contributions";

alter table "public"."circle_api_keys" drop column "read_contributions";
