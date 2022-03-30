alter table "public"."teammates" add constraint "teammates_user_id_team_mate_id_key" unique ("user_id", "team_mate_id");
