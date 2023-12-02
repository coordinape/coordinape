import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { Box, Flex } from '../../../ui';

import { fetchTopSkills } from './fetchTopSkills';

export const Skills = () => {
  const { data: skills } = useQuery(['exploreSkills'], fetchTopSkills);

  return (
    <Flex column css={{ width: '100%' }}>
      {skills === undefined ? (
        <LoadingIndicator />
      ) : (
        <Box
          css={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '$md',
          }}
        >
          {skills.map(s => (
            <SkillTag large skill={s.name} key={s.name} count={s.count} />
          ))}
        </Box>
      )}
    </Flex>
  );
};
