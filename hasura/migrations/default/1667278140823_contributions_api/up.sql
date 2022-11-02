
alter table "public"."circle_api_keys" add column "read_contributions" boolean
 not null default 'false';

alter table "public"."circle_api_keys" add column "create_contributions" boolean
 not null default 'false';

alter table "public"."contributions" add column "created_with_api_key_hash" text
 null;

alter table "public"."contributions"
  add constraint "contributions_created_with_api_key_hash_fkey"
  foreign key ("created_with_api_key_hash")
  references "public"."circle_api_keys"
  ("hash") on update restrict on delete no action;
