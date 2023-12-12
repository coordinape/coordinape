import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { SkillTag } from '../../../features/colinks/SkillTag';
import { coLinksPaths } from '../../../routes/paths';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import { SkillComboBox } from '../../AccountPage/SkillAndTopicPicker';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';
import { PeopleWithSkill } from './PeopleWithSkill';
import { Skills } from './Skills';

export const ExploreSkills = () => {
  const { skill } = useParams();
  const navigate = useNavigate();
  return (
    <SingleColumnLayout>
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
                  css={{ mb: '-2px' }}
                />
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
          <SkillComboBox
            onSelect={skill => navigate(coLinksPaths.exploreSkill(skill))}
            show={true}
            excludeSkills={[]}
            allowAdd={false}
          />
        </Flex>
      </ContentHeader>
      <Flex>{skill ? <PeopleWithSkill skill={skill} /> : <Skills />}</Flex>
    </SingleColumnLayout>
  );
};
