import { useQuery } from 'react-query';

import { AiLight } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Flex, Text } from '../../ui';
import {
  CoLinksMember,
  coLinksMemberSelector,
} from 'pages/colinks/explore/CoLinksMember';

import { RightColumnSection } from './RightColumnSection';

const getSimilarProfiles = async (addressUnknownCase: string) => {
  const address = addressUnknownCase.toLowerCase();
  const { getSimilarProfiles } = await client.query(
    {
      getSimilarProfiles: [
        {
          payload: {
            address: address,
          },
        },
        {
          profile_public: coLinksMemberSelector(address),
        },
      ],
    },
    { operationName: 'similarProfiles' },
  );

  return getSimilarProfiles.map(p => p.profile_public);
};

export const SimilarProfiles = ({ address }: { address: string }) => {
  const { data } = useQuery(['similar_profiles', address], async () => {
    return getSimilarProfiles(address);
  });

  if (!data) return null;

  return (
    <RightColumnSection
      title={
        <Text color={'default'} semibold>
          <AiLight
            nostroke
            size="lg"
            css={{
              '*': {
                fill: 'currentColor',
              },
            }}
          />
          {data?.length} Similar Profiles
        </Text>
      }
    >
      <Flex column css={{ gap: '$md', width: '100%' }}>
        {data.map(p => {
          return p && <CoLinksMember key={p.id} profile={p} size={'small'} />;
        })}
      </Flex>
    </RightColumnSection>
  );
};
