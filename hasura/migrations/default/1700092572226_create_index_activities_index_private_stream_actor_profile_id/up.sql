CREATE  INDEX "activities_index_private_stream_actor_profile_id" on
  "public"."activities" using btree ("private_stream", "actor_profile_id");
