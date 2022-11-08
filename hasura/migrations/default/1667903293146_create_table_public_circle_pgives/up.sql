CREATE TABLE "public"."circle_pgives" 
("id" serial NOT NULL, 
"month" integer NOT NULL, 
"year" integer NOT NULL, 
"circle_id" integer NOT NULL, 
"normalized_pgives" numeric NOT NULL DEFAULT 0, 
"active_months" integer NOT NULL DEFAULT 0,
PRIMARY KEY ("id") , 
FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON UPDATE restrict ON DELETE restrict, 
UNIQUE ("id"));
COMMENT ON TABLE "public"."circle_pgives" IS E'circle pgive pot allocation';
