CREATE  INDEX "idx_profiles_device_login_token" on
  "public"."profiles" using hash ("device_login_token");
