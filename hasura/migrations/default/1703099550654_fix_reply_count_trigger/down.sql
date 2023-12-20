DROP TRIGGER trigger_update_reply_count ON replies;

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
