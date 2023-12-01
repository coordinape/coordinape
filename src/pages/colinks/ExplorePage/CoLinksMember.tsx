import { NavLink } from 'react-router-dom';

import { SkillTag } from '../../../features/colinks/SkillTag';
import { coLinksPaths } from '../../../routes/paths';
import { Flex, Text } from '../../../ui';

import { AvatarWithLinks } from './AvatarWithLinks';
import { ProfileForCard } from './fetchPeopleWithSkills';
import { SimpleBuyButton } from './SimpleBuyButton';

export const CoLinksMember = ({ profile }: { profile: ProfileForCard }) => {
  return (
    <Flex
      as={NavLink}
      to={coLinksPaths.profile(profile.address || '')}
      css={{
        color: '$text',
        textDecoration: 'none',
        background: '$surface',
        borderRadius: '$3',
        p: '$md',
        gap: '$lg',
        width: '100%',
      }}
    >
      <Flex column css={{ gap: '$lg', alignItems: 'center' }}>
        <AvatarWithLinks profile={profile} />
        {profile.holdingAmount !== undefined && profile.holdingAmount > 0 && (
          <Text color={'neutral'} size={'xs'} semibold>
            You hold {profile.holdingAmount}
            {/*{profile.holdingAmount == 1 ? '' : 's'}*/}
          </Text>
        )}
      </Flex>
      <Flex column css={{ gap: '$sm', flex: 1 }}>
        <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Text semibold>{profile.name}</Text>
          <Flex css={{ gap: '$md' }}>
            {profile.links && <SimpleBuyButton links={profile.links} />}
          </Flex>
        </Flex>
        <Text size={'small'}>{profile.description}</Text>

        {profile.profile_skills && (
          <Flex css={{ gap: '$sm' }}>
            {profile.profile_skills.map(s => (
              <SkillTag key={s.skill_name} skill={s.skill_name} />
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
