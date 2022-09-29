import { Panel, Text } from '../../ui';

import { Contributions } from './queries';

// Contribution renders an individual contribution in the GiveDrawer
export const Contribution = ({
  contribution,
}: {
  contribution: Contributions[number];
}) => {
  return (
    <Panel background css={{ mb: '$md', padding: '$sm' }}>
      <Panel nested>
        <Text p>{contribution.description}</Text>
      </Panel>
    </Panel>
  );
};
