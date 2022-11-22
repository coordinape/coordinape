CREATE TABLE "public"."member_epoch_pgives" 
("id" serial NOT NULL, 
"epoch_id" integer NOT NULL, 
"user_id" integer NOT NULL, 
"pgive" numeric NOT NULL DEFAULT 0, 
"normalized_pgive" numeric NOT NULL DEFAULT 0, 
"gives_received" integer NOT NULL DEFAULT 0, 
"opt_out_bonus" numeric NOT NULL DEFAULT 0, 
"created_at" timestamptz NOT NULL DEFAULT now(), 

PRIMARY KEY ("id") , 
FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE restrict ON DELETE restrict, 
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, 
UNIQUE ("id"), UNIQUE ("user_id", "epoch_id"));
COMMENT ON TABLE "public"."member_epoch_pgives" IS E'member allocated pgives per epoch';
