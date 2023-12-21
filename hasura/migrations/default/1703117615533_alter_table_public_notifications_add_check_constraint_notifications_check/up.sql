alter table "public"."notifications" drop constraint "notifications_check";
alter table "public"."notifications" add constraint "notifications_check" check (reply_id IS NOT NULL OR invite_joined_id IS NOT NULL OR link_tx_hash IS NOT NULL OR reaction_id IS NOT NULL OR mention_reply_id IS NOT NULL OR mention_post_id IS NOT NULL);
