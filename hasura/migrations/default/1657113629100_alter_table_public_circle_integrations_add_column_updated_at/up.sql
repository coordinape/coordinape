alter table "public"."circle_integrations" add column "updated_at" timestamptz NOT NULL DEFAULT now()
 null;
