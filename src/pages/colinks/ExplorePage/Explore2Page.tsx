import { useSearchParams } from 'react-router-dom';

import { Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { PeopleWithSkill } from './PeopleWithSkill';
import { Skills } from './Skills';

export const Explore2Page = () => {
  const [search] = useSearchParams();
  const skill = search.get('skill');
  return (
    <SingleColumnLayout>
      <Text h1>Explore: Skills and Topics</Text>
      <Flex>{skill ? <PeopleWithSkill skill={skill} /> : <Skills />}</Flex>
    </SingleColumnLayout>
  );
};
