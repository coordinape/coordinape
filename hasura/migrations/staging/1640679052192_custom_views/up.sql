

CREATE VIEW circle_private AS
  SELECT id AS circle_id, discord_webhook
    FROM circles;

CREATE VIEW gift_private AS
 SELECT recipient_id, sender_id, note
   FROM token_gifts;

CREATE VIEW pending_gift_private AS
 SELECT recipient_id, sender_id, note
   FROM pending_token_gifts;
