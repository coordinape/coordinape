import { Flex, MarkdownPreview } from '../../ui';

import type { Activity } from './ActivityItem';

export interface ContributionActivity extends Activity {
  contribution?: {
    description: string;
    user: {
      profile: {
        name: string;
        avatar?: string;
      };
    };
  };
}

export const ContributionActivity = ({
  activity,
}: {
  activity: ContributionActivity;
}) => {
  return (
    <Flex css={{ display: 'block' }}>
      <MarkdownPreview
        render
        css={{
          p: 0,
        }}
        source={activity?.contribution?.description}
      />
    </Flex>
  );
};
