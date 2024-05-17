import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>Explore Skills / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            <Flex css={{ gap: '$md', alignItems: 'center' }}>
              Explore{' '}
              {skill && (
                <SkillTag
                  skill={skill}
                  size={'large'}
                  active
                  css={{ mb: '-2px', span: { maxWidth: 300 } }}
                />
              )}
            </Flex>
          </Text>
          <Text>
            {skill ? 'People who share this interest' : 'Most Hype Interests'}
          </Text>
          <ExploreBreadCrumbs
            subsection={!skill ? 'Interests' : undefined}
            skill={skill}
          />
        </Flex>
      </ContentHeader>
      <Flex>{skill ? <PeopleWithSkill skill={skill} /> : <Skills />}</Flex>
    </SingleColumnLayout>
  );
};
