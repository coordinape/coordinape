CREATE  INDEX "idx_created_at" on
  "public"."contributions" using brin ("created_at");
