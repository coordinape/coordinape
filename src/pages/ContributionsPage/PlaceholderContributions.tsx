import { DateTime } from 'luxon';

import { Box, Text } from '../../ui';

import { ContributionPanel } from './ContributionPanel';
import { ContributionRow } from './ContributionRow';

const placeholders = [
  'Designed pickleball jerseys for each Circle in the DAO',
  'Had solid meeting with Do Kwon',
  'Investigated naming rights to the basketball arena in Miami',
  'Wrote another manifesto',
];

export const PlaceholderContributions = () => {
  return (
    <ContributionPanel>
      <Box>
        <Text variant="label">Your Contributions might look like these</Text>
      </Box>
      {placeholders.map((c, idx) => (
        <ContributionRow
          key={idx}
          description={c}
          datetime_created={DateTime.now()
            .minus({ hours: idx + 1 })
            .toISO()}
          active={false}
          disabled={true}
        />
      ))}
    </ContributionPanel>
  );
};
