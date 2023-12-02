import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { Flex } from '../../../ui';

import { fetchTopSkills } from './fetchTopSkills';

export const Skills = () => {
  const { data: skills } = useQuery(['exploreSkills'], fetchTopSkills);

  return (
    <Flex column css={{ width: '100%' }}>
      {skills === undefined ? (
        <LoadingIndicator />
      ) : (
        <Flex
          css={{
            width: '100%',
            // display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '$md',
            // justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          {skills.map(s => (
            <SkillTag large skill={s.name} key={s.name} count={s.count} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};
