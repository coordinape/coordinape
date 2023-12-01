CREATE  INDEX "epoches_index_ended" on
  "public"."epoches" using btree ("ended")
  WHERE ended = true;
