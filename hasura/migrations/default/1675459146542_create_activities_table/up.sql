CREATE TABLE "public"."activities" (
    "id" bigserial NOT NULL,
    "circle_id" bigint,
    "organization_id" bigint NOT NULL,
    "actor_profile_id" bigint,
    "target_profile_id" bigint,
    "contribution_id" bigint,
    "epoch_id" bigint,
    "user_id" bigint,

    "action" varchar(100) NOT NULL,

    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY ("id") ,
  FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON UPDATE CASCADE ON DELETE CASCADE,

  FOREIGN KEY ("actor_profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE,

  FOREIGN KEY ("contribution_id") REFERENCES "public"."contributions"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE,

  CONSTRAINT "enforce_foreign_key_exists"
    CHECK (
      circle_id IS NOT NULL OR
      target_profile_id IS NOT NULL OR
      epoch_id IS NOT NULL OR
      contribution_id IS NOT NULL OR
      user_id IS NOT NULL
    )
);


CREATE INDEX activities_index_id_circle_id ON "public"."activities" ("id", "circle_id");

COMMENT ON TABLE "public"."activities" IS E'Table containing activity on our platform';

CREATE TRIGGER "set_public_activities_updated_at"
BEFORE UPDATE ON "public"."activities"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
