

CREATE or REPLACE VIEW public.circle_private AS
  SELECT id AS circle_id, discord_webhook
    FROM circles;

CREATE or REPLACE VIEW public.gift_private AS
 SELECT id as gift_id, recipient_id, sender_id, note
   FROM token_gifts;

CREATE or REPLACE VIEW public.pending_gift_private AS
 SELECT id as gift_id, recipient_id, sender_id, note
   FROM pending_token_gifts;
