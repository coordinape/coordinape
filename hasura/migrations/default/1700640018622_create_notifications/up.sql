
CREATE TABLE "public"."notifications" (
    "id" serial PRIMARY KEY,
    "profile_id" int8 NOT NULL,
    "actor_profile_id" int8 NULL,
    "reply_id" integer NULL,
    "invite_joined_id" int8 NULL,
    "link_tx_hash" citext NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("reply_id") REFERENCES "public"."replies"("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("link_tx_hash") REFERENCES "public"."link_tx"("tx_hash") ON UPDATE CASCADE ON DELETE CASCADE,
    CHECK (reply_id IS NOT NULL OR invite_joined_id IS NOT NULL OR link_tx_hash IS NOT NULL)
);

alter table "public"."profiles" add column "last_read_notification_id" integer
 null;

CREATE  INDEX "idx_notifications_profile_id" on
  "public"."notifications" using btree ("profile_id");

alter table "public"."notifications" add column "reaction_id" int8
 null;

alter table "public"."notifications"
  add constraint "notifications_reaction_id_fkey"
  foreign key ("reaction_id")
  references "public"."reactions"
  ("id") on update cascade on delete cascade;

alter table "public"."notifications" drop constraint "notifications_check";
alter table "public"."notifications" add constraint "notifications_check" check (reply_id IS NOT NULL OR invite_joined_id IS NOT NULL OR link_tx_hash IS NOT NULL OR reaction_id IS NOT NULL);
