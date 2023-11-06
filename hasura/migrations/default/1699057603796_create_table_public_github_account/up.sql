CREATE TABLE
  "public"."github_account" (
    "profile_id" int8 NOT NULL,
    "user_token" text NOT NULL,
    "installation_token" text NULL,
    "username" text NOT NULL,
    "github_id" int8 NOT NULL,
    "avatar_url" text NOT NULL,
    "name" text,
    "company" text,
    "blog" text,
    "location" text,
    "email" text,
    "bio" text,
    "twitter_username" text,
    "public_repos" integer NOT NULL DEFAULT 0,
    "followers" integer NOT NULL DEFAULT 0,
    "following" integer NOT NULL DEFAULT 0,
    "github_created_at" timestamptz NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now (),
    PRIMARY KEY ("profile_id"),
    FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON UPDATE cascade ON DELETE cascade,
    UNIQUE ("profile_id")
  );

alter table "public"."reputation_scores"
add column "github_score" integer not null default '0';
