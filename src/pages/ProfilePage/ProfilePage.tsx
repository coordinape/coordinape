import React, { Suspense, useEffect, useState } from 'react';

import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { fileToBase64 } from 'lib/base64';
import { updateProfileBackground } from 'lib/gql/mutations';
import { Role } from 'lib/users';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { ActivityList } from '../../features/activities/ActivityList';
import {
  FormFileUpload,
  LoadingModal,
  ProfileSkills,
  ProfileSocialIcons,
} from 'components';
import { EditProfileModal } from 'components/EditProfileModal';
import { useImageUploader, useToast } from 'hooks';
import { useFetchManifest } from 'hooks/legacyApi';
import useMobileDetect from 'hooks/useMobileDetect';
import { ExternalLink, Edit3 } from 'icons/__generated';
import { useMyProfile } from 'recoilState';
import { EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE, paths } from 'routes/paths';
import { Avatar, Box, Button, Flex, Link, MarkdownPreview, Text } from 'ui';
import { getAvatarPath } from 'utils/domain';

import {
  queryProfilePgive,
  queryProfile,
  QUERY_KEY_PROFILE_TOTAL_PGIVE,
  QueryProfilePgive,
} from './queries';

import type { IMyProfile, IProfile } from 'types';

export const ProfilePage = () => {
  const { profileAddress: address } = useParams();

  // FIXME replace this with react-query
  const myProfile = useMyProfile();

  const { data: totalPgive } = useQuery(
    [QUERY_KEY_PROFILE_TOTAL_PGIVE, address],
    () => queryProfilePgive(address),
    {
      enabled: !!address,
      staleTime: Infinity,
    }
  );

  const isMe = address === 'me' || address === myProfile.address;
  if (!(isMe || address?.startsWith('0x'))) {
    return <></>; // todo better 404?
  }
  return isMe ? (
    <MyProfilePage totalPgive={totalPgive} />
  ) : (
    <OtherProfilePage address={address} totalPgive={totalPgive} />
  );
};

const MyProfilePage = ({ totalPgive }: { totalPgive: QueryProfilePgive }) => {
  const myProfile = useMyProfile();

  return (
    <ProfilePageContent profile={myProfile} totalPgive={totalPgive} isMe />
  );
};

const OtherProfilePage = ({
  address,
  totalPgive,
}: {
  address: string;
  totalPgive: QueryProfilePgive;
}) => {
  const { data: profile } = useQuery(
    ['profile', address],
    () => queryProfile(address),
    { staleTime: Infinity }
  );

  return !profile ? (
    <LoadingModal visible note="profile" />
  ) : (
    <ProfilePageContent profile={profile} totalPgive={totalPgive} />
  );
};

const ProfilePageContent = ({
  profile,
  isMe,
  totalPgive,
}: {
  profile: IMyProfile | IProfile;
  isMe?: boolean;
  totalPgive: QueryProfilePgive;
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

  useEffect(() => {
    if (name === 'unknown') {
      showError("Couldn't find that user");
      navigate('/');
    }
  }, [name]);

  const CoSoulArtWithButton = ({ css }: { css?: CSS }) => {
    return (
      <Flex
        column
        css={{
          gap: '$lg',
          position: 'relative',
          ...css,
        }}
      >
        <CoSoulArt
          pGive={totalPgive}
          address={profile.address}
          animate={true}
          width="320px"
        />
        <Button
          color="secondary"
          size="large"
          onClick={() => {
            navigate(paths.cosoulView(profile.address));
          }}
          css={{ whiteSpace: 'pre-wrap', width: '320px' }}
        >
          Check CoSoul Stats {<ExternalLink />}
        </Button>
      </Flex>
    );
  };

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
            css={{
              justifyContent: 'space-between',
              gap: '$lg',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
            <Flex css={{ gap: '$lg' }}>
              {!isMobile && (
                <Avatar
                  path={profile?.avatar}
                  css={{
                    width: '96px !important',
                    height: '96px !important',
                  }}
                />
              )}
              <Flex column css={{ alignItems: 'flex-start', gap: '$md' }}>
                <Flex css={{ gap: '$lg' }}>
                  {isMobile && (
                    <Avatar
                      path={profile?.avatar}
                      css={{
                        width: '96px !important',
                        height: '96px !important',
                      }}
                    />
                  )}
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
                    allocate to us from within your circles. All tokens received
                    go to the Coordinape treasury.{' '}
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
                {isMobile && <CoSoulArtWithButton />}
              </Flex>
            </Flex>
            <Flex column css={{ alignSelf: 'flex-end' }}>
              <Button color="primary" onClick={() => setEditProfileOpen(true)}>
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
          <Flex column css={{ mt: '$2xl', rowGap: '$lg' }}>
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
        {!isMobile && (
          <CoSoulArtWithButton
            css={{
              top: '-160px',
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
