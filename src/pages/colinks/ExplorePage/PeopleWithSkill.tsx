import React from 'react';

import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { SkillTag } from '../../../features/colinks/SkillTag';
import useConnectedAddress from '../../../hooks/useConnectedAddress';
import { ArrowLeft } from '../../../icons/__generated';
import { coLinksPaths } from '../../../routes/paths';
import { Button, Flex, Panel, Text } from '../../../ui';

import { CoLinksMember } from './CoLinksMember';
import { fetchPeopleWithSkill } from './fetchPeopleWithSkills';

export const PeopleWithSkill = ({ skill }: { skill: string }) => {
  const address = useConnectedAddress(true);
  const { data: profiles } = useQuery(['explorePeopleWithSkill', skill], () =>
    fetchPeopleWithSkill(skill, address)
  );
  return (
    <Flex column css={{ gap: '$lg' }}>
      <Flex>
        <Button
          as={NavLink}
          to={coLinksPaths.explore2}
          css={{ flexShrink: 1, width: 'auto' }}
        >
          <ArrowLeft color={'inherit'} /> All Skills
        </Button>
      </Flex>
      <Text h2>
        People who care about
        <SkillTag large css={{ ml: '$md' }} active={true} skill={skill} />
      </Text>
      {profiles === undefined ? (
        <LoadingIndicator />
      ) : profiles.length === 0 ? (
        <Panel noBorder>
          <Text>No people have this skill/topic yet.</Text>
        </Panel>
      ) : (
        profiles.map(p => p && <CoLinksMember key={p.id} profile={p} />)
      )}
    </Flex>
  );
};
