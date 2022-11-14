alter table "public"."epoches" add column "pgive" numeric
 not null default '0';

alter table "public"."epoches" add column "gives_receiver_base" numeric
not null default '0';

alter table "public"."epoches" add column "active_months_bonus" numeric
 not null default '0';

alter table "public"."epoches" add column "notes_bonus" numeric
 not null default '0';

 alter table "public"."epoches" add column "processed" boolean
 not null default false;
