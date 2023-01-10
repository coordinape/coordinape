import React, { useEffect } from 'react';

import { transparentize } from 'polished';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { colors } from 'stitches.config';

import {
  ProfileSocialIcons,
  ProfileSkills,
  FormFileUpload,
  scrollToTop,
} from 'components';
import { USER_ROLE_COORDINAPE } from 'config/constants';
import { useImageUploader, useApiWithProfile, useApeSnackbar } from 'hooks';
import { useSomeCircleId } from 'hooks/migration';
import { Edit3 } from 'icons/__generated';
import { useMyProfile, useProfile } from 'recoilState/app';
import { useSetEditProfileOpen } from 'recoilState/ui';
import { EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE, paths } from 'routes/paths';
import { Avatar, Box, Button, Flex, MarkdownPreview, Text } from 'ui';
import { getAvatarPath } from 'utils/domain';

import { IMyProfile, IProfile } from 'types';

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
  const profile = useProfile(address);
  const circleId = useSomeCircleId();

  return <ProfilePageContent profile={profile} circleId={circleId} />;
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
    user?.name ||
    users?.[0]?.profile?.name ||
    users?.[0]?.name ||
    'unknown';

  const setEditProfileOpen = useSetEditProfileOpen();
  const { updateBackground } = useApiWithProfile();
  const navigate = useNavigate();

  const goToCircleHistory = (id: number, path: string) => {
    scrollToTop();
    navigate(path);
  };

  const {
    imageUrl: backgroundUrl,
    formFileUploadProps: backgroundUploadProps,
  } = useImageUploader(
    getAvatarPath(profile?.background) || '/imgs/background/profile-bg.jpg'
  );

  const recentEpochs = profile?.users?.map(user => ({
    bio: (user?.bio?.length ?? 0) > 0 ? user.bio : null,
    circle: user.circle,
  }));

  const { showError } = useApeSnackbar();

  useEffect(() => {
    if (name === 'unknown') {
      showError("Couldn't find that user");
      navigate('/');
    }
  }, [name]);

  return (
    <Flex column css={{ height: '100%', alignItems: 'center' }}>
      <Flex
        column
        css={{
          position: 'relative',
          alignItems: 'center',
          height: '307px',
          width: '100%',
          '& > img': {
            position: 'absolute',
            objectFit: 'cover',
            top: 0,
            width: '100%',
            height: '235px',
          },
        }}
      >
        <img src={backgroundUrl} alt={name} />
        <Box
          css={{
            position: 'relative',
            height: '300px',
            width: '100%',
            maxWidth: '1300px',
            padding: '0 $3xl',
            '@xs': {
              padding: '0 $md',
            },
          }}
        >
          <Avatar
            path={profile?.avatar}
            css={{
              top: 155,
              width: '143px !important',
              height: '143px !important',
            }}
          />
          {isMe && (
            <>
              <FormFileUpload
                css={{ position: 'absolute', top: 22, right: 16 }}
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
              <Button
                css={{ position: 'absolute', bottom: 0, right: 28 }}
                color="primary"
                onClick={() => setEditProfileOpen(true)}
              >
                <Edit3 />
                Edit Profile
              </Button>
            </>
          )}
        </Box>
      </Flex>

      <Box
        css={{
          width: '100%',
          maxWidth: '1300px',
          padding: '0 $3xl',
          '@xs': {
            padding: '0 $md',
          },
        }}
      >
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
        <Box
          css={{
            color: '$text',
            pb: '$2xl',
            whiteSpace: 'pre-wrap',
            fontWeight: '$light',
            fontSize: '$h3',
            lineHeight: '$short',
          }}
        >
          {user?.role === USER_ROLE_COORDINAPE ? (
            <div>
              Coordinape is the platform you’re using right now! We currently
              offer our service for free and invite people to allocate to us
              from within your circles. All tokens received go to the Coordinape
              treasury.{' '}
              <a
                href={EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE}
                rel="noreferrer"
                target="_blank"
              >
                Let us know what you think.
              </a>
            </div>
          ) : (
            <MarkdownPreview source={profile?.bio} />
          )}
        </Box>
      </Box>
      {user && !user.isCoordinapeUser && (
        <Box
          css={{
            width: '100%',
            maxWidth: '1300px',
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
                      fontWeight: '$light',
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
                          paths.history(u.circle_id)
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
                        fontWeight: '$light',
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
          fontWeight: '$bold',
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
