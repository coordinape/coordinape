import { useParams } from 'react-router-dom';

import { SkillTag } from '../../../features/colinks/SkillTag';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';
import { PeopleWithSkill } from './PeopleWithSkill';
import { Skills } from './Skills';

export const ExploreSkills = () => {
  const { skill } = useParams();
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            <Flex css={{ gap: '$md', alignItems: 'center' }}>
              Explore{' '}
              {skill && (
                <SkillTag skill={skill} large active css={{ mb: '-2px' }} />
              )}
            </Flex>
          </Text>
          <Text>
            {skill
              ? 'People who share this interest'
              : 'Most Hype Skills and Topics'}
          </Text>
          <ExploreBreadCrumbs
            subsection={!skill ? 'Skills' : undefined}
            skill={skill}
          />
        </Flex>
      </ContentHeader>
      <Flex>{skill ? <PeopleWithSkill skill={skill} /> : <Skills />}</Flex>
    </SingleColumnLayout>
  );
};
