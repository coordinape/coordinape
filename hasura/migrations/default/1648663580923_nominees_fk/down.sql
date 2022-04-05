alter table "public"."nominees"
  drop constraint "nominees_circle_id_fkey";

alter table "public"."vouches"
  drop constraint "vouches_nominee_id_fkey";

alter table "public"."vouches"
  drop constraint "vouches_voucher_id_fkey";