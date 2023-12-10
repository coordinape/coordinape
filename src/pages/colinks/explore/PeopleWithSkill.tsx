import React from 'react';

import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import useConnectedAddress from '../../../hooks/useConnectedAddress';
import { Flex, Panel, Text } from '../../../ui';

import { CoLinksMember } from './CoLinksMember';
import { fetchPeopleWithSkill } from './fetchPeopleWithSkills';

export const PeopleWithSkill = ({ skill }: { skill: string }) => {
  const address = useConnectedAddress(true);
  const { data: profiles } = useQuery(['explorePeopleWithSkill', skill], () =>
    fetchPeopleWithSkill(skill, address)
  );
  return (
    <Flex column css={{ gap: '$lg', maxWidth: '$readable' }}>
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
