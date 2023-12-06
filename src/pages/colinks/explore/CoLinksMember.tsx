import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { LinkTxProgress } from '../../../features/colinks/LinkTxProgress';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { Selector } from '../../../lib/gql/__generated__/zeus';
import { coLinksPaths } from '../../../routes/paths';
import { Box, Flex, Text } from '../../../ui';

import { AvatarWithLinks } from './AvatarWithLinks';
import { ProfileForCard } from './fetchPeopleWithSkills';
import { SimpleBuyButtonWithPrice } from './SimpleBuyButtonWithPrice';

export const linkHolderGradient = `linear-gradient(.15turn, color-mix(in srgb, $linkOwnedHighlight 40%, $background), $surface 30%)`;

export const CoLinksMember = ({
  profile,
  rankNumber,
  small = false,
}: {
  profile: ProfileForCard;
  rankNumber?: number;
  small?: boolean;
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

  if (small)
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
        <AvatarWithLinks profile={profile} size={'medium'} />
        <Text semibold>{profile.name}</Text>
      </Flex>
    );

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
        <Flex column css={{ gap: '$lg', alignItems: 'center' }}>
          <AvatarWithLinks profile={profile} />
          {holdingAmount !== undefined && holdingAmount > 0 && (
            <Text css={{ color: '$headingText' }} size={'xs'} semibold>
              You Hold {holdingAmount}
              {/*{profile.holdingAmount == 1 ? '' : 's'}*/}
            </Text>
          )}
        </Flex>
        <Flex column css={{ gap: '$sm', flex: 1 }}>
          <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text semibold>{profile.name}</Text>
            <Flex css={{ gap: '$md' }}>
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
            <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
              {profile.profile_skills.map(s => (
                <SkillTag key={s.skill_name} skill={s.skill_name} />
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
