import { useQuery } from 'react-query';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { Share2 } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';
import { Panel, Text } from '../../ui';
import { APP_URL } from '../../utils/domain';

// sup
export const InviteCodeLink = ({ profileId }: { profileId: number }) => {
  const { data } = useQuery(['invitecode'], async () => {
    const { profiles_by_pk } = await client.query(
      {
        profiles_by_pk: [
          {
            id: profileId,
          },
          {
            invite_code: true,
          },
        ],
      },
      {
        operationName: 'invitecode',
      }
    );
    return profiles_by_pk;
  });

  return (
    <Panel noBorder css={{ width: '100%' }}>
      <Text color={'default'} semibold css={{ gap: '$sm', mb: '$sm' }}>
        <Share2 /> Share Your Invite Link
      </Text>
      {data?.invite_code && (
        <CopyCodeTextField
          value={APP_URL + paths.coLinksInvite(data.invite_code)}
        />
      )}
    </Panel>
  );
};
