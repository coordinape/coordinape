
CREATE TABLE "public"."reputation_scores" ("profile_id" int8 NOT NULL, "total_score" integer NOT NULL, "twitter_score" integer NOT NULL, "email_score" integer NOT NULL, PRIMARY KEY ("profile_id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("profile_id"));

alter table "public"."reputation_scores" add column "pgive_score" integer
 not null;

alter table "public"."reputation_scores" add column "keys_score" integer
 not null;
