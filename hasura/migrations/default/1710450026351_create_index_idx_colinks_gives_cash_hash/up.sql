CREATE  INDEX "idx_colinks_gives_cash_hash" on
  "public"."colinks_gives" using btree ("cast_hash");
