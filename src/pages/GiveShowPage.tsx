import assert from 'assert';

import { Give } from 'features/colinks/RecentGives';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingModal } from '../components';
import { Flex, Panel, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

export const GIVE_SHOW_PAGE_QUERY_KEY = 'colinks_give_show_page';

export const GiveShowPage = () => {
  const { id } = useParams();
  assert(id);

  const { data, isLoading } = useQuery(
    [GIVE_SHOW_PAGE_QUERY_KEY, id],
    async () => {
      const { colinks_gives_by_pk } = await anonClient.query(
        {
          colinks_gives_by_pk: [
            {
              id: Number(id),
            },
            {
              attestation_uid: true,
              created_at: true,
              id: true,
              cast_hash: true,
              skill: true,
              giver_profile_public: { address: true, name: true, avatar: true },
              target_profile_public: {
                address: true,
                name: true,
                avatar: true,
              },
            },
          ],
        },
        {
          operationName: 'coLinks_give_show_page @cached(ttl: 30)',
        }
      );
      return colinks_gives_by_pk;
    }
  );

  if (!data && isLoading) {
    return <LoadingModal visible={true} />;
  }
  if (!data) {
    return (
      <Panel alert css={{ m: '$xl' }}>
        <Text>Give could not be found.</Text>
      </Panel>
    );
  }

  return (
    <SingleColumnLayout>
      <Flex column css={{ gap: '$md', maxWidth: '200px' }}>
        <Flex css={{ flexWrap: 'wrap', columnGap: '2.5%' }}>
          <Give key={data.id} give={data} />
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
