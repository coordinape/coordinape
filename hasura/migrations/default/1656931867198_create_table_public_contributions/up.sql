CREATE TABLE "public"."contributions"
(
    "id" serial NOT NULL,
    "epoch_id" integer,
    "user_id" integer NOT NULL,
    "description" text,
    "deleted_at" timestamptz,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id") ,
    FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id"));
