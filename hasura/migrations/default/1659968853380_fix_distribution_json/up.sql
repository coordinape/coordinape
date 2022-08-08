update distributions 
set distribution_json = (distribution_json #>> '{}')::jsonb;