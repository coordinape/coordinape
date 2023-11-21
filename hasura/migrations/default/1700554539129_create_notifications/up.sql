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
