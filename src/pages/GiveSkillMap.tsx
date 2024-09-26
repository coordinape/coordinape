import { NavLink, useParams } from 'react-router-dom';
import { useDebounce, useElementSize } from 'usehooks-ts';

import { webAppURL } from '../config/webAppURL';
import { Wand } from '../icons/__generated';
import { disabledStyle } from '../stitches.config';
import { coLinksPaths } from 'routes/paths';
import { Box, Button, Flex, Link, Text } from 'ui';
import { PartyDisplayText } from 'ui/Tooltip/PartyDisplayText';

import { GiveGraph } from './NetworkViz/GiveGraph';

export const GiveSkillMap = () => {
  const { skill } = useParams();

  const castMapUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(skill ? '#' + skill + ' GIVE Leaders' : '')}&embeds[]=${webAppURL('colinks')}/api/frames/router/meta/skill.leaderboard/${encodeURIComponent(skill ?? '')}`;

  const [setRef, size] = useElementSize();

  const widthOffset = 32;

  const debouncedSize = useDebounce(size);
  return (
    <>
      <Flex
        column
        css={{
          justifyContent: 'center',
          // width: '100%',
        }}
        ref={setRef}
      >
        {/*This div is just for reference width */}
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
          <Wand fa size={'md'} /> {debouncedSize.width} Cast in Farcaster
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
            {skill && debouncedSize.width > 0 ? (
              <Box
                style={{
                  height: 800,
                  width: debouncedSize.width - widthOffset,
                  // overflow: 'clip',
                }}
              >
                <GiveGraph
                  skill={skill}
                  width={debouncedSize.width - widthOffset}
                  height={800}
                />
              </Box>
            ) : //
            null}
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
                to={coLinksPaths.giveSkill(`${skill}`)}
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
