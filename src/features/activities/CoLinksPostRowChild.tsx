import { MarkdownPreview } from '../../ui';
import { PostForm } from '../colinks/PostForm';

import { PostRowChildProps } from './PostRow';
import { Activity, Contribution } from './useInfiniteActivities';

export const CoLinksPostRowChild = ({
  editable,
  editing,
  activity,
  setEditing,
}: PostRowChildProps & { activity: Activity & Contribution }) => {
  return (
    <>
      {editable && (
        <>
          {editing && (
            <>
              <PostForm
                label={'Edit Post'}
                css={{ textarea: { background: '$surfaceNested ' } }}
                editContribution={activity.contribution}
                setEditingContribution={setEditing}
                placeholder={''}
              />
            </>
          )}
        </>
      )}
      {!editing && (
        <MarkdownPreview
          render
          source={activity.contribution.description}
          css={{
            cursor: 'auto',
            mb: '-$xs',
            mt: '$xs',
          }}
        />
      )}
    </>
  );
};
