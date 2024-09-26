import { Navigate, useParams } from 'react-router-dom';

import { coLinksPaths } from '../../../routes/paths';
import { Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileCards } from './ProfileCards';
import { ProfileHeader } from './ProfileHeader';
import { ProfilePageGiveContents } from './ProfilePageGiveContents';

export const ViewProfilePageGive = () => {
  const { address } = useParams();

  if (!address) {
    return <Flex>address query param required</Flex>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <Flex
        css={{
          gap: '$xl',
          justifyContent: 'space-between',
          '@sm': { flexDirection: 'column' },
        }}
      >
        {/*<ResponsiveColumnLayout css={{ px: 0, mx: 0 }}>*/}
        <ProfilePageGiveContents targetAddress={address} />
        <ProfileCards targetAddress={address} forceDisplay />
        {/*</ResponsiveColumnLayout>*/}
      </Flex>
    </SingleColumnLayout>
  );
};

export const GivePartyProfileRedirect = () => {
  const { address } = useParams();
  return <Navigate to={coLinksPaths.profileGive(address ?? '')} replace />;
};
