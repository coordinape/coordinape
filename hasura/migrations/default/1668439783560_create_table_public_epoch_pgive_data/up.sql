CREATE TABLE "public"."epoch_pgive_data" 
("id" serial NOT NULL, 
"pgive" numeric NOT NULL DEFAULT 0, 
"gives_receiver_base" numeric NOT NULL DEFAULT 0, 
"active_months_bonus" numeric NOT NULL DEFAULT 0, 
"notes_bonus" numeric NOT NULL DEFAULT 0, 
"epoch_id" integer NOT NULL, 
"created_at" timestamptz NOT NULL DEFAULT now(), 
PRIMARY KEY ("id") , 
FOREIGN KEY ("epoch_id") REFERENCES "public"."epoches"("id") ON UPDATE restrict ON DELETE restrict, 
UNIQUE ("id"), 
UNIQUE ("epoch_id"));
