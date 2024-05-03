import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

import { Flex, Text } from '../../ui';
import { GemCoOutline } from 'icons/__generated';

export const PartyGiveReceived = ({ profileId }: { profileId: number }) => {
  const { data } = useQuery(
    ['party_give_received', profileId],
    async () => {
      const { numGiveReceived, numGiveSent } = await anonClient.query(
        {
          __alias: {
            numGiveSent: {
              colinks_gives_aggregate: [
                {
                  where: {
                    profile_id: {
                      _eq: profileId,
                    },
                  },
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
            numGiveReceived: {
              colinks_gives_aggregate: [
                {
                  where: {
                    target_profile_id: {
                      _eq: profileId,
                    },
                  },
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
          },
        },
        {
          operationName: 'getGiveReceived',
        }
      );

      return {
        numGiveReceived: numGiveReceived.aggregate?.count ?? 0,
        numGiveSent: numGiveSent.aggregate?.count ?? 0,
      };
    },
    {
      enabled: !!profileId,
    }
  );

  if (!data) return null;

  return (
    <Flex css={{ columnGap: '$lg', rowGap: '$sm', flexWrap: 'wrap' }}>
      <Text
        size="medium"
        color={'secondary'}
        title={'GIVE Received'}
        css={{
          gap: '$sm',
          whiteSpace: 'nowrap',
        }}
      >
        <Text semibold>{data.numGiveReceived}</Text>
        <GemCoOutline fa />
        <Text>GIVE Received </Text>
      </Text>
      <Text
        size="medium"
        color={'secondary'}
        title={'GIVE Received'}
        css={{
          gap: '$sm',
          whiteSpace: 'nowrap',
        }}
      >
        <Text semibold>{data.numGiveSent}</Text>
        <GemCoOutline fa />
        <Text>GIVE Sent </Text>
      </Text>
    </Flex>
  );
};
