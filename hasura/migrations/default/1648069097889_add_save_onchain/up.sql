
alter table "public"."distributions" add column "saved_on_chain" boolean
 not null default 'false';

alter table "public"."vaults" alter column "symbol" set not null;
