alter table "public"."pending_token_gifts" add constraint "pending_token_gifts_sender_id_recipient_id_epoch_id_key" unique ("sender_id", "recipient_id", "epoch_id");
