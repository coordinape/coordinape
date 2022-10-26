alter table "public"."organizations" add column "sandbox" boolean
 not null default 'false';
comment on column "public"."organizations"."sandbox" is E'Indicates a test/sample/sandbox org';