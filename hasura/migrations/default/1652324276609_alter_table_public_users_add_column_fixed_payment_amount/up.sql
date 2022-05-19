alter table "public"."users" add column "fixed_payment_amount" numeric
 not null default '0.00';
