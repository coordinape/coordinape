

CREATE TABLE "public"."big_questions" ("id" serial NOT NULL, "prompt" text NOT NULL, "description" text, "cover_image_url" text NOT NULL, "publish_at" timestamp, "expire_at" timestamp, "created_at" timestamp NOT NULL DEFAULT now(), "updated_at" timestamp NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));
ALTER TABLE "public"."big_questions" ALTER COLUMN "id" TYPE int8;

alter table "public"."big_questions" add column "css_background_position" text
 null;

alter table "public"."activities" add column "big_question_id" int8
 null;

alter table "public"."activities"
  add constraint "activities_big_question_id_fkey"
  foreign key ("big_question_id")
  references "public"."big_questions"
  ("id") on update cascade on delete cascade;

alter table "public"."activities" drop constraint "enforce_foreign_key_exists";
alter table "public"."activities" add constraint "enforce_foreign_key_exists" check (circle_id IS NOT NULL OR target_profile_id IS NOT NULL OR epoch_id IS NOT NULL OR contribution_id IS NOT NULL OR user_id IS NOT NULL OR big_question_id IS NOT NULL);

alter table "public"."contributions" add column "big_question_id" bigint
 null;

alter table "public"."contributions"
  add constraint "contributions_big_question_id_fkey"
  foreign key ("big_question_id")
  references "public"."big_questions"
  ("id") on update cascade on delete cascade;

CREATE UNIQUE INDEX unique_contribution_per_big_question
ON contributions (big_question_id, profile_id)
WHERE deleted_at IS NULL;

