DROP INDEX IF EXISTS "public"."cosouls_index_address";

CREATE  INDEX "cosouls_index_address" on
  "public"."cosouls" using btree ("address");
