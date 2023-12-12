import { useState } from 'react';

import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { SkillTag } from '../../../features/colinks/SkillTag';
import { Flex } from '../../../ui';

import { fetchTopSkills, Where } from './fetchTopSkills';

export const Skills = () => {
  const [where] = useState<Where>({});

  // const navigate = useNavigate();
  const { data: skills } = useQuery(
    ['exploreSkills', JSON.stringify(where)],
    () => fetchTopSkills({ where })
  );

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
            <SkillTag
              size={'large'}
              skill={s.name}
              key={s.name}
              count={s.count}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};
