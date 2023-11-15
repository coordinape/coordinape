CREATE  INDEX "idx_profile_id_private_stream" on
  "public"."contributions" using btree ("profile_id", "private_stream");
