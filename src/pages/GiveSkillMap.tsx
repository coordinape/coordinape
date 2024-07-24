import { NavLink, useParams } from 'react-router-dom';

import { webAppURL } from '../config/webAppURL';
import { Wand } from '../icons/__generated';
import { disabledStyle } from '../stitches.config';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Link, Text } from 'ui';
import { PartyDisplayText } from 'ui/Tooltip/PartyDisplayText';

import { GiveGraph } from './NetworkViz/GiveGraph';

export const GiveSkillMap = () => {
  const { skill } = useParams();

  const castMapUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(skill ? '#' + skill + ' GIVE Leaders' : '')}&embeds[]=${webAppURL('colinks')}/api/frames/router/meta/skill.leaderboard/${encodeURIComponent(skill ?? '')}`;
  return (
    <>
      <Flex
        css={{
          justifyContent: 'center',
        }}
      >
        <Button
          as={Link}
          href={castMapUrl}
          target="_blank"
          rel="noreferrer"
          css={{
            ...(!skill && {
              ...disabledStyle,
            }),
          }}
        >
          <Wand fa size={'md'} /> Cast in Farcaster
        </Button>
      </Flex>

      {/*Content*/}
      <Flex
        css={{
          padding: '16px',
          borderRadius: '$2',
          // border: 'solid 1px #424a51',
          '@tablet': {
            p: '0 8px',
          },
        }}
      >
        {/*Table*/}
        <Flex
          css={{
            width: '100%',
            flexFlow: 'column',
            alignItems: 'flex-start',
            color: 'white',
            backgroundColor: 'rgb(8 18 29 / 40%)',
            borderRadius: '$3',
            py: '$md',
          }}
        >
          <Text
            h2
            css={{
              width: '100%',
              justifyContent: 'center',
              m: '$xs 0 $md',
              alignItems: 'baseline',
              gap: '$xs',
            }}
          >
            <PartyDisplayText text={`#${skill}`} />
            <Text semibold>GIVEs</Text>
          </Text>

          <Flex
            css={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              borderRadius: '$2',
              mb: '$sm',
            }}
          >
            {skill && <GiveGraph skill={skill} height={800} />}
            <Flex
              css={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                as={NavLink}
                to={coLinksPaths.giveBoardSkill(`${skill}`)}
                color={'cta'}
                size="xs"
              >
                View Data Table
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
