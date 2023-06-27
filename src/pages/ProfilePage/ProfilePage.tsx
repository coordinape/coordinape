import React, { Suspense, useEffect, useState } from 'react';

import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { fileToBase64 } from 'lib/base64';
import { updateProfileBackground } from 'lib/gql/mutations';
import { Role } from 'lib/users';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { ActivityList } from '../../features/activities/ActivityList';
import {
  FormFileUpload,
  LoadingModal,
  ProfileSkills,
  ProfileSocialIcons,
} from 'components';
import { EditProfileModal } from 'components/EditProfileModal';
import isFeatureEnabled from 'config/features';
import { useImageUploader, useToast } from 'hooks';
import { useFetchManifest } from 'hooks/legacyApi';
import useMobileDetect from 'hooks/useMobileDetect';
import { Edit3, ExternalLink } from 'icons/__generated';
import { useMyProfile } from 'recoilState';
import { EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE, paths } from 'routes/paths';
import { Avatar, Box, Button, Flex, Link, MarkdownPreview, Text } from 'ui';
import { getAvatarPath } from 'utils/domain';

import {
  QUERY_KEY_PROFILE_TOTAL_PGIVE,
  queryProfile,
  queryProfilePgive,
} from './queries';

import type { IMyProfile, IProfile } from 'types';

export const ProfilePage = () => {
  const { profileAddress: address } = useParams();

  // FIXME replace this with react-query
  const myProfile = useMyProfile();

  const isMe = address === 'me' || address === myProfile.address;
  if (!(isMe || address?.startsWith('0x'))) {
    return <></>; // todo better 404?
  }
  return isMe ? <MyProfilePage /> : <OtherProfilePage address={address} />;
};

const MyProfilePage = () => {
  const myProfile = useMyProfile();

  return <ProfilePageContent profile={myProfile} isMe />;
};

const OtherProfilePage = ({ address }: { address: string }) => {
  const { data: profile } = useQuery(
    ['profile', address],
    () => queryProfile(address),
    { staleTime: Infinity }
  );

  return !profile ? (
    <LoadingModal visible note="profile" />
  ) : (
    <ProfilePageContent profile={profile} />
  );
};

const ProfilePageContent = ({
  profile,
  isMe,
}: {
  profile: IMyProfile | IProfile;
  isMe?: boolean;
}) => {
  const users = (profile as IMyProfile)?.myUsers ?? profile?.users ?? [];
  const user = users[0];
  const name =
    profile.name ||
    user?.profile?.name ||
    users?.[0]?.profile?.name ||
    'unknown';

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const fetchManifest = useFetchManifest();
  const updateBackground = async (newAvatar: File) => {
    const image_data_base64 = await fileToBase64(newAvatar);
    await updateProfileBackground(image_data_base64);
    // FIXME fetchManifest instead of updating the changed field is wasteful
    await fetchManifest();
  };
  const navigate = useNavigate();
  const { isMobile } = useMobileDetect();

  const {
    imageUrl: backgroundUrl,
    formFileUploadProps: backgroundUploadProps,
  } = useImageUploader(getAvatarPath(profile?.background) || '');

  const { showError } = useToast();
  const artWidth = '320px';

  const { data: coSoul } = useQuery(
    [QUERY_KEY_PROFILE_TOTAL_PGIVE, profile.address],
    () => queryProfilePgive(profile.address),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    if (name === 'unknown') {
      showError("Couldn't find that user");
      navigate('/');
    }
    // eslint-disable-next-line no-console
    console.log({ coSoul });
    // eslint-disable-next-line no-console
    console.log(
      'cosoulEnabled:',
      isFeatureEnabled('cosoul'),
      ' mintInfo:',
      !!coSoul?.mintInfo
    );
  }, [name, coSoul]);

  return (
    <Flex column>
      <Flex
        row
        css={{
          width: '100%',
          minHeight: '300px',
          background: backgroundUrl ? `url(${backgroundUrl})` : 'white',

          backgroundImage: backgroundUrl
            ? undefined
            : 'radial-gradient(circle at center -30px, $profileGradientStart, $profileGradientEnd), repeating-radial-gradient(circle at center -30px, $profileGradientEnd, $profileGradientEnd, 83px, transparent 106px, transparent 83px)',
          backgroundBlendMode: 'multiply',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {isMe && (
          <Box css={{ alignSelf: 'flex-end', m: '$lg' }}>
            <FormFileUpload
              editText="Edit Background"
              uploadText="Upload Background"
              {...backgroundUploadProps}
              commit={f =>
                updateBackground(f)
                  .catch(console.warn)
                  .then(() => backgroundUploadProps.onChange(undefined))
              }
              accept="image/gif, image/jpeg, image/png"
            />
          </Box>
        )}
      </Flex>
      <Flex
        css={{
          gap: '$md',
          m: '$lg',
          justifyContent: 'space-between',
        }}
      >
        <Flex column css={{ px: '$sm', width: '100%' }}>
          <Flex
            row
            css={{
              justifyContent: 'space-between',
              position: 'relative',
              gap: '$lg',
              '@sm': {
                flexDirection: 'column',
              },
            }}
          >
            <Flex
              css={{
                width: '100%',
                mr: `calc(${artWidth} + $lg)`,
                gap: '$md',
                '@sm': {
                  mr: 0,
                },
              }}
            >
              <Flex
                css={{
                  gap: '$lg',
                  width: '100%',
                }}
              >
                {!isMobile && <Avatar size="xl" path={profile?.avatar} />}
                <Flex column css={{ alignItems: 'flex-start', gap: '$md' }}>
                  <Flex css={{ gap: '$lg' }}>
                    {isMobile && <Avatar size="xl" path={profile?.avatar} />}
                    <Text
                      h2
                      css={{
                        wordBreak: 'break-word',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {name}
                    </Text>
                    <Flex css={{ alignItems: 'center' }}>
                      <ProfileSocialIcons profile={profile} />
                    </Flex>
                  </Flex>

                  {user?.role === Role.COORDINAPE ? (
                    <div>
                      Coordinape is the platform you’re using right now! We
                      currently offer our service for free and invite people to
                      allocate to us from within your circles. All tokens
                      received go to the Coordinape treasury.{' '}
                      <Link
                        inlineLink
                        href={EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Let us know what you think.
                      </Link>
                    </div>
                  ) : (
                    <MarkdownPreview
                      render
                      source={profile?.bio}
                      css={{ cursor: 'default' }}
                    />
                  )}
                  <Flex
                    css={{
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    <ProfileSkills
                      skills={profile.skills ?? []}
                      isAdmin={user?.role === 1}
                      max={50}
                    />
                  </Flex>
                </Flex>
              </Flex>
              <Flex column>
                <Button
                  color="primary"
                  onClick={() => setEditProfileOpen(true)}
                >
                  <Edit3 />
                  Edit Profile
                </Button>
                <Suspense fallback={<></>}>
                  <EditProfileModal
                    open={editProfileOpen}
                    onClose={() => setEditProfileOpen(false)}
                  />
                </Suspense>
              </Flex>
            </Flex>
            {isFeatureEnabled('cosoul') && coSoul?.mintInfo && (
              <Flex
                column
                css={{
                  gap: '$md',
                  position: 'absolute',
                  right: 0,
                  top: '-160px',
                  '@sm': {
                    position: 'relative',
                    top: 0,
                    alignItems: 'center',
                  },
                }}
              >
                <CoSoulArt
                  pGive={coSoul.totalPgive}
                  address={profile.address}
                  width={artWidth}
                />
                <Button
                  color="secondary"
                  onClick={() => {
                    navigate(paths.cosoulView(profile.address));
                  }}
                  css={{ whiteSpace: 'pre-wrap' }}
                >
                  Check CoSoul Stats {<ExternalLink />}
                </Button>
              </Flex>
            )}
          </Flex>
          <Flex
            column
            css={{
              mt: '$2xl',
              rowGap: '$lg',
              width: `calc(100% - ${artWidth} - $lg)`,
              '@sm': {
                width: '100%',
              },
              '.contributionRow': {
                background: '$surface ',
                p: '$md $md $md 0',
              },
            }}
          >
            <Text size="large">Recent Activity</Text>
            <ActivityList
              drawer
              queryKey={['profile-activities', profile.id]}
              where={{
                _or: [
                  { target_profile_id: { _eq: profile.id } },
                  { actor_profile_id: { _eq: profile.id } },
                ],
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
