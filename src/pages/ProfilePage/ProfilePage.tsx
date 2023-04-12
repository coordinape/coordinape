import React, { Suspense, useEffect, useState } from 'react';

import { fileToBase64 } from 'lib/base64';
import { updateProfileBackground } from 'lib/gql/mutations';
import { Role } from 'lib/users';
import { transparentize } from 'polished';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { colors } from 'stitches.config';

import { ActivityList } from '../../features/activities/ActivityList';
import { RecentActivityTitle } from '../../features/activities/RecentActivityTitle';
import {
  FormFileUpload,
  LoadingModal,
  ProfileSkills,
  ProfileSocialIcons,
  scrollToTop,
} from 'components';
import { EditProfileModal } from 'components/EditProfileModal';
import { useImageUploader, useToast } from 'hooks';
import { useFetchManifest } from 'hooks/legacyApi';
import { useSomeCircleId } from 'hooks/migration';
import { Edit3 } from 'icons/__generated';
import { useMyProfile } from 'recoilState/app';
import { EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE, paths } from 'routes/paths';
import { Avatar, Box, Button, Flex, Link, MarkdownPreview, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { getAvatarPath } from 'utils/domain';

import { queryProfile } from './queries';

import type { IMyProfile, IProfile } from 'types';

export const ProfilePage = () => {
  const { profileAddress: address } = useParams();

  const myProfile = useMyProfile();
  const isMe = address === 'me' || address === myProfile.address;
  if (!(isMe || address?.startsWith('0x'))) {
    return <></>; // todo better 404?
  }
  return isMe ? <MyProfilePage /> : <OtherProfilePage address={address} />;
};

const MyProfilePage = () => {
  const myProfile = useMyProfile();
  const circleId = useSomeCircleId();

  return <ProfilePageContent profile={myProfile} circleId={circleId} isMe />;
};

const OtherProfilePage = ({ address }: { address: string }) => {
  const circleId = useSomeCircleId();

  const { data: profile } = useQuery(
    ['profile', address],
    () => queryProfile(address),
    { staleTime: Infinity }
  );

  return !profile ? (
    <LoadingModal visible note="profile" />
  ) : (
    <ProfilePageContent profile={profile} circleId={circleId} />
  );
};

const ProfilePageContent = ({
  profile,
  circleId,
  isMe,
}: {
  profile: IMyProfile | IProfile;
  circleId: number | undefined;
  isMe?: boolean;
}) => {
  const users = (profile as IMyProfile)?.myUsers ?? profile?.users ?? [];
  const user = users.find(user => user.circle_id === circleId);
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

  const goToCircleHistory = (id: number, path: string) => {
    scrollToTop();
    navigate(path);
  };

  const {
    imageUrl: backgroundUrl,
    formFileUploadProps: backgroundUploadProps,
  } = useImageUploader(getAvatarPath(profile?.background) || '');

  const recentEpochs = profile?.users?.map(user => ({
    bio: (user?.bio?.length ?? 0) > 0 ? user.bio : null,
    circle: user.circle,
  }));

  const { showError } = useToast();

  useEffect(() => {
    if (name === 'unknown') {
      showError("Couldn't find that user");
      navigate('/');
    }
  }, [name]);

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
        <SingleColumnLayout
          css={{
            width: '100%',
            p: '0 $lg',
            m: '$lg auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Flex css={{ alignItems: 'flex-end' }}>
            <Avatar
              path={profile?.avatar}
              css={{
                width: '143px !important',
                height: '143px !important',
              }}
            />
          </Flex>
          {isMe && (
            <Flex column css={{ justifyContent: 'space-between' }}>
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
          )}
        </SingleColumnLayout>
      </Flex>
      <SingleColumnLayout css={{ width: '100%', m: 'auto' }}>
        <Text
          h2
          css={{
            mt: 18,
            mb: 12,
            display: '-webkit-box',
            '-webkit-line-clamp': 4,
            '-webkit-box-orient': 'vertical',
            wordBreak: 'break-word',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {name}
        </Text>
        <Flex
          css={{ flexWrap: 'wrap', justifyContent: 'center', padding: '0 10%' }}
        >
          <ProfileSkills
            skills={profile.skills ?? []}
            isAdmin={user?.role === 1}
            max={50}
          />
        </Flex>
        <Flex css={{ padding: '$lg 0', alignItems: 'center' }}>
          <ProfileSocialIcons profile={profile} />
        </Flex>
        {user?.role === Role.COORDINAPE ? (
          <div>
            Coordinape is the platform you’re using right now! We currently
            offer our service for free and invite people to allocate to us from
            within your circles. All tokens received go to the Coordinape
            treasury.{' '}
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
        {user && !user.isCoordinapeUser && (
          <Box
            css={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: '$lg',
              pb: '$2xl',
              '@sm': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& > *': {
                  width: '100%',
                },
              },
            }}
          >
            <Section title="My Circles">
              {profile?.users?.map(
                u =>
                  u.circle && (
                    <Flex
                      column
                      key={u.id}
                      css={{
                        alignItems: 'center',
                        fontSize: '$small',
                        lineHeight: '$short',
                        cursor: 'pointer',
                        color: transparentize(0.3, colors.text),
                        margin: '$sm',
                      }}
                    >
                      <Avatar
                        name={u.circle.name}
                        size="small"
                        path={u.circle.logo}
                        onClick={() =>
                          goToCircleHistory(
                            u.circle_id,
                            paths.circle(u.circle_id)
                          )
                        }
                      />

                      <span>
                        {u.circle.organization.name} {u.circle.name}
                      </span>
                      {u.non_receiver && <span>Opted-Out</span>}
                    </Flex>
                  )
              )}
            </Section>
            <Section title="Recent Epoch Activity" asColumn>
              {recentEpochs?.map(
                ({ bio, circle }, i) =>
                  circle && (
                    <Box
                      css={{
                        textAlign: 'center',
                        fontSize: '$medium',
                        lineHeight: '$short',
                      }}
                      key={i}
                    >
                      <Box css={{ color: '$text', fontWeight: '$semibold' }}>
                        {circle.organization.name} {circle.name}
                      </Box>
                      <Box
                        css={{
                          color: transparentize(0.3, colors.text),
                          margin: '$xxs 0 $lg',
                        }}
                      >
                        {bio}
                      </Box>
                    </Box>
                  )
              )}
            </Section>
            {/* <Section title="Frequent Collaborators">TODO.</Section> */}
          </Box>
        )}
        <Box>
          <RecentActivityTitle />
          <ActivityList
            queryKey={['profile-activities', profile.id]}
            where={{
              _or: [
                { target_profile_id: { _eq: profile.id } },
                { actor_profile_id: { _eq: profile.id } },
              ],
            }}
          />
        </Box>
      </SingleColumnLayout>
    </Flex>
  );
};

const Section = ({
  title,
  children,
  asColumn,
}: {
  title: string;
  children?: React.ReactNode;
  asColumn?: boolean;
}) => {
  return (
    <Flex column css={{ alignItems: 'center' }}>
      <Text
        p
        css={{
          fontWeight: '$semibold',
          color: transparentize(0.3, colors.text),
          padding: '0 0 $sm',
          margin: '$xl 0 $md',
          borderBottom: '0.7px solid rgba(24, 24, 24, 0.1)',
          width: '60%',
          minWidth: 300,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Box
        css={
          asColumn
            ? {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }
            : {
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }
        }
      >
        {children}
      </Box>
    </Flex>
  );
};

export default ProfilePage;
