CREATE  INDEX "activites_index_contribution_id" on
  "public"."activities" using btree ("contribution_id");

CREATE  INDEX "contributions_index_profile_id_private_stream" on
  "public"."contributions" using btree ("profile_id", "private_stream");


alter table "public"."activities" add column "reaction_count" integer
 not null default '0';

alter table "public"."activities" add column "reply_count" integer
  not null default '0';


-- Function to update the reply_count in the activities table
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
        -- Update the reply_count based on the current number of replies
        UPDATE activities
        SET reply_count = (
            SELECT COUNT(*)
            FROM replies
            WHERE activity_id = COALESCE(NEW.activity_id, OLD.activity_id)
        )
        WHERE id = COALESCE(NEW.activity_id, OLD.activity_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle updates on insert or delete in the replies table
CREATE TRIGGER trigger_update_reply_count
AFTER INSERT OR DELETE ON replies
FOR EACH ROW
EXECUTE FUNCTION update_reply_count();


-- Function to update the reaction_count in the activities table
CREATE OR REPLACE FUNCTION update_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
        -- Update the reaction_count based on the current number of reactions
        UPDATE activities
        SET reaction_count = (
            SELECT COUNT(*)
            FROM reactions
            WHERE activity_id = COALESCE(NEW.activity_id, OLD.activity_id)
        )
        WHERE id = COALESCE(NEW.activity_id, OLD.activity_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle updates on insert or delete in the reactions table
CREATE TRIGGER trigger_update_reaction_count
AFTER INSERT OR DELETE ON reactions
FOR EACH ROW
EXECUTE FUNCTION update_reaction_count();


UPDATE activities
SET reply_count = subquery.reply_count
FROM (
    SELECT activity_id, COUNT(*) as reply_count
    FROM replies
    GROUP BY activity_id
) AS subquery
WHERE activities.id = subquery.activity_id;


UPDATE activities
SET reaction_count = subquery.reaction_count
FROM (
    SELECT activity_id, COUNT(*) as reaction_count
    FROM reactions
    GROUP BY activity_id
) AS subquery
WHERE activities.id = subquery.activity_id;
