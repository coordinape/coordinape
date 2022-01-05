

CREATE VIEW public.circle_private AS
  SELECT id AS circle_id, discord_webhook
    FROM circles;

CREATE VIEW public.gift_private AS
 SELECT recipient_id, sender_id, note
   FROM token_gifts;

CREATE VIEW public.pending_gift_private AS
 SELECT recipient_id, sender_id, note
   FROM pending_token_gifts;
