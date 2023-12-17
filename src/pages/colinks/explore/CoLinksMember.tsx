import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { CoLinksStats } from '../../../features/colinks/CoLinksStats';
import { LinkTxProgress } from '../../../features/colinks/LinkTxProgress';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { Selector } from '../../../lib/gql/__generated__/zeus';
import { coLinksPaths } from '../../../routes/paths';
import { Avatar, Box, Flex, Text } from '../../../ui';

import { ProfileForCard } from './fetchPeopleWithSkills';
import { SimpleBuyButtonWithPrice } from './SimpleBuyButtonWithPrice';

export const linkHolderGradient = `linear-gradient(0.05turn, color-mix(in srgb, $linkOwnedHighlight 40%, $background), $surface 50%)`;

export const CoLinksMember = ({
  profile,
  rankNumber,
  size = 'large',
}: {
  profile: ProfileForCard;
  rankNumber?: number;
  size?: 'large' | 'small' | 'medium' | 'long';
}) => {
  const [buyProgress, setBuyProgress] = useState('');
  const holdingAmount = !profile.link_target
    ? undefined
    : profile.link_target[0]?.amount;

  const onBought = () => {
    setBuyProgress('');
  };

  if (!profile.address) {
    return null;
  }

  if (size === 'small')
    return (
      <Flex
        as={NavLink}
        to={coLinksPaths.profile(profile.address || '')}
        css={{
          position: 'relative',
          color: '$text',
          textDecoration: 'none',
          background: '$surface',
          borderRadius: '$3',
          gap: '$md',
          width: '100%',
        }}
      >
        <Avatar size={'medium'} name={profile.name} path={profile.avatar} />
        <Text semibold>{profile.name}</Text>
      </Flex>
    );

  if (size === 'long') {
    return (
      <Flex
        css={{
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Flex
          as={NavLink}
          to={coLinksPaths.profile(profile.address || '')}
          css={{
            position: 'relative',
            color: '$text',
            textDecoration: 'none',
            p: '$sm',
            gap: '$lg',
            width: '100%',
          }}
        >
          <Flex column css={{ alignItems: 'center' }}>
            <Avatar size={'small'} name={profile.name} path={profile.avatar} />
          </Flex>
          <Flex
            css={{
              justifyContent: 'space-between',
              alignItems: 'center',
              columnGap: '$md',
              rowGap: '$sm',
              width: '100%',
              flexDirection: 'row',
              '@sm': {
                flexDirection: 'column',
                gap: '$sm',
              },
            }}
          >
            <Flex
              css={{
                gap: '$md',
                flexGrow: '1',
              }}
            >
              <Text semibold>{profile.name}</Text>
              <CoLinksStats
                address={profile.address}
                links={profile.links ?? 0}
                score={profile.reputation_score?.total_score ?? 0}
                holdingCount={holdingAmount ?? 0}
              />
            </Flex>
            <Flex
              css={{
                gap: '$md',
                justifyContent: 'space-between',
                alignItems: 'center',
                '@md': {
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                  gap: '$sm',
                },
              }}
            >
              {profile.links !== undefined && profile.links > 0 && (
                <SimpleBuyButtonWithPrice
                  links={profile.links}
                  target={profile.address}
                  setProgress={setBuyProgress}
                  onSuccess={onBought}
                />
              )}
            </Flex>
          </Flex>
          {rankNumber && buyProgress === '' && (
            <Box
              css={{
                position: 'absolute',
                top: -12,
                left: -12,
                zIndex: 9,
              }}
            >
              <Flex
                css={{
                  borderRadius: 99999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '$background',
                  color: '$text',
                  p: '2px $xs',
                  width: 32,
                  height: 32,
                }}
              >
                <Flex css={{ alignItems: 'center', gap: '2px' }}>
                  <Text semibold size={'xs'}>
                    #{rankNumber}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          )}
        </Flex>

        <LinkTxProgress message={buyProgress} />
      </Flex>
    );
  }

  return (
    <Flex css={{ alignItems: 'center', gap: '$md', position: 'relative' }}>
      <Flex
        as={NavLink}
        to={coLinksPaths.profile(profile.address || '')}
        css={{
          position: 'relative',
          color: '$text',
          textDecoration: 'none',
          background:
            holdingAmount !== undefined && holdingAmount > 0
              ? linkHolderGradient
              : '$surface',
          borderRadius: '$3',
          p: '$md',
          gap: '$lg',
          width: '100%',
        }}
      >
        <Flex column css={{ gap: '$md', alignItems: 'center' }}>
          <Avatar size={'large'} name={profile.name} path={profile.avatar} />
        </Flex>
        <Flex column css={{ gap: '$sm', flex: 1 }}>
          <Flex
            css={{
              justifyContent: 'space-between',
              alignItems: 'center',
              columnGap: '$md',
              rowGap: '$sm',
              width: '100%',
              flexDirection: size === 'medium' ? 'column' : 'row',
              '@sm': {
                alignItems: 'flex-start',
                flexDirection: 'column',
                gap: '$sm',
              },
            }}
          >
            <Flex
              css={{
                gap: '$md',
                flexGrow: '1',
              }}
            >
              <Text semibold>{profile.name}</Text>
              {size !== 'medium' && (
                <CoLinksStats
                  address={profile.address}
                  links={profile.links ?? 0}
                  score={profile.reputation_score?.total_score ?? 0}
                  holdingCount={holdingAmount ?? 0}
                />
              )}
            </Flex>
            <Flex
              css={{
                gap: '$md',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: size === 'medium' ? '100%' : undefined,
                '@md': {
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                  gap: '$sm',
                },
              }}
            >
              {size === 'medium' && (
                <CoLinksStats
                  address={profile.address}
                  links={profile.links ?? 0}
                  score={profile.reputation_score?.total_score ?? 0}
                  holdingCount={holdingAmount ?? 0}
                />
              )}
              {profile.links !== undefined && profile.links > 0 && (
                <SimpleBuyButtonWithPrice
                  links={profile.links}
                  target={profile.address}
                  setProgress={setBuyProgress}
                  onSuccess={onBought}
                />
              )}
            </Flex>
          </Flex>
          <Text size={'small'}>{profile.description}</Text>

          {profile.profile_skills && (
            <Flex css={{ gap: '$xs', flexWrap: 'wrap' }}>
              {profile.profile_skills.map(s => (
                <SkillTag
                  size="small"
                  key={s.skill_name}
                  skill={s.skill_name}
                />
              ))}
            </Flex>
          )}
        </Flex>
        {rankNumber && buyProgress === '' && (
          <Box
            css={{
              position: 'absolute',
              top: -12,
              left: -12,
              zIndex: 9,
            }}
          >
            <Flex
              css={{
                borderRadius: 99999,
                alignItems: 'center',
                justifyContent: 'center',
                background: '$background',
                color: '$text',
                p: '2px $xs',
                width: 32,
                height: 32,
              }}
            >
              <Flex css={{ alignItems: 'center', gap: '2px' }}>
                <Text semibold size={'xs'}>
                  #{rankNumber}
                </Text>
              </Flex>
            </Flex>
          </Box>
        )}
      </Flex>

      <LinkTxProgress message={buyProgress} />
    </Flex>
  );
};

export const coLinksMemberSelector = (currentUserAddress: string) =>
  Selector('profiles_public')({
    avatar: true,
    name: true,
    id: true,
    address: true,
    description: true,
    links: true,
    links_held: true,
    reputation_score: {
      total_score: true,
    },
    link_target: [
      {
        where: {
          holder: {
            _eq: currentUserAddress,
          },
        },
      },
      {
        amount: true,
      },
    ],
    profile_skills: [
      {},
      {
        skill_name: true,
      },
    ],
  });
