import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import useProfileId from 'hooks/useProfileId';
import { useFarcasterUser } from 'pages/GiveParty/useFarcasterUser';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Avatar, Flex, Text } from 'ui';

import { CoLinksProfile, fetchCoLinksProfile } from './ProfileHeader';

export const ProfileAvatarAndName = ({
  targetAddress,
  drawer = false,
}: {
  targetAddress: string;
  drawer?: boolean;
}) => {
  const currentUserProfileId = useProfileId(false);
  const { data: targetProfile } = useQuery(
    [QUERY_KEY_COLINKS, targetAddress, 'profile'],
    () => {
      if (!targetAddress) return;
      return fetchCoLinksProfile(targetAddress, currentUserProfileId);
    },
    {
      enabled: !!targetAddress,
    }
  );
  if (!targetProfile) return <LoadingIndicator />;
  return (
    <ProfileHeaderWithProfile
      targetProfile={targetProfile}
      targetAddress={targetAddress}
      drawer={drawer}
    />
  );
};
const ProfileHeaderWithProfile = ({
  targetProfile,
  targetAddress,
  drawer,
}: {
  targetProfile: CoLinksProfile;
  targetAddress: string;
  drawer: boolean;
}) => {
  const { data: fcUser } = useFarcasterUser(targetAddress!);

  const { profile } = targetProfile;

  return (
    <>
      {!drawer && (
        <Helmet>
          <title>{targetProfile.profile.name} / CoLinks</title>
        </Helmet>
      )}
      <Flex
        column
        css={{
          width: '100%',
          flexGrow: 1,
          position: 'relative',
          zIndex: 3,
        }}
      >
        <Flex
          css={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '$md',
            flexWrap: 'wrap',
          }}
        >
          <Flex className="profileHeader" column css={{ gap: '$md' }}>
            <Flex className="avatarName">
              <AppLink
                to={coLinksPaths.profileGive(
                  profile?.address ??
                    fcUser?.verified_addresses.eth_addresses[0] ??
                    fcUser?.custody_address ??
                    ''
                )}
                css={{
                  display: 'flex',
                  gap: '$sm',
                }}
              >
                <Avatar
                  size="xs"
                  name={profile.name}
                  path={profile.avatar}
                  margin="none"
                />
                <Text
                  semibold
                  display
                  css={{
                    color: '$textOnCta',
                  }}
                >
                  {profile.name}
                </Text>
              </AppLink>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
