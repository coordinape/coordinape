import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { giveTrendingData } from '../../../_api/give/trending';
import { Flex, Link, Panel, Text } from '../../ui';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';

export const OtherGiveSkills = ({ skipFirst }: { skipFirst: number }) => {
  const { data, isFetched } = useQuery(
    ['GiveHome', 'OtherGiveSkills'],
    async (): Promise<giveTrendingData> => {
      const res = await fetch('/api/give/trending');
      return res.json();
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (!isFetched) return null;

  // Exclude the top n skills
  const otherSkills = data?.slice(skipFirst);

  return (
    <Flex column>
      <Flex
        column
        as={NavLink}
        to={coLinksPaths.give}
        css={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          mb: '$md',
          borderRadius: '$3',
          background: '$tagSuccessBackground',
          p: '$md',
          color: '$tagSuccessText',
          textDecoration: 'none',
        }}
      >
        <Flex
          css={{
            alignItems: 'center',
            gap: '$sm',
            pb: '$xs',
            borderBottom: '1px solid $tagSuccessText',
          }}
        >
          <Text
            h2
            display
            css={{
              color: '$tagSuccessText',
            }}
          >
            Hot GIVE
          </Text>
        </Flex>
        <Text
          size="small"
          css={{
            mt: '$sm',
            height: 'auto',
            color: '$tagSuccessText',
          }}
        >
          More GIVE to explore
        </Text>
      </Flex>
      <Panel
        noBorder
        css={{ flexDirection: 'row', gap: '$sm', flexWrap: 'wrap' }}
      >
        {otherSkills?.map(g => (
          <>
            <Link as={NavLink} to={coLinksPaths.giveSkill(g.skill)}>
              <Text tag color="complete" size="small" css={{ gap: '$xs' }}>
                <Text size="small" css={{ fontWeight: 'normal' }}>
                  +1
                </Text>
                <GemCoOutline fa size={'md'} />
                <Text css={skillTextStyle}>{g.skill}</Text>
              </Text>
            </Link>
          </>
        ))}
      </Panel>
    </Flex>
  );
};
