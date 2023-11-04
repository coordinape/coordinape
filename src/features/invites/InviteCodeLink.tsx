import { useQuery } from 'react-query';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';
import { Panel, Text } from '../../ui';
import { APP_URL } from '../../utils/domain';

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
    <Panel css={{ maxWidth: 400 }}>
      <Text variant="label" css={{ mb: '$xs' }}>
        Share this link to build your network
      </Text>
      {data?.invite_code && (
        <CopyCodeTextField
          value={APP_URL + paths.soulKeysInvite(data.invite_code)}
        />
      )}
    </Panel>
  );
};
