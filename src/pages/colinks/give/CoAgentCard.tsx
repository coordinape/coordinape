import { Flex, Link, Text } from '../../../ui';
import { Cylinder } from 'icons/__generated';
import { EXTERNAL_URL_COAGENTS } from 'routes/paths';

import { LearnCard, contentStyles } from './LearnCard';

export const CoAgentCard = () => {
  return (
    <>
      <Link href={EXTERNAL_URL_COAGENTS} target="_blank" rel="nofollow">
        <LearnCard image="/imgs/background/coagent.jpg">
          <Flex
            column
            css={{
              ...contentStyles,
              justifyContent: 'space-between',
              background:
                'radial-gradient(circle at 25% 0%, rgb(105 105 105 / 19%) 10%, rgb(5 24 69 / 21%) 100%)',
            }}
          >
            <Flex
              column
              css={{
                alignItems: 'center',
                gap: '$sm',
                justifyContent: 'center',
                flexGrow: 1,
              }}
            >
              <Cylinder size="2xl" fa />
              <Text size="large" semibold css={{ textAlign: 'center' }}>
                CoAgents
              </Text>
            </Flex>
            <Flex
              column
              css={{
                alignItems: 'center',
                gap: '$sm',
                background:
                  'radial-gradient(circle at 25% 0%, #085673 10%, #843104 100%)',
                p: '$sm',
                width: '100%',
              }}
            >
              <Text size="small" css={{ textAlign: 'center' }}>
                Set up a CoAgent <br />
                in your Farcaster community
              </Text>
            </Flex>
          </Flex>
        </LearnCard>
      </Link>
    </>
  );
};

export const codeStyle = {
  color: '$link',
  background: '$surface',
  fontFamily: 'monospace',
  fontWeight: '$semibold',
  whiteSpace: 'nowrap',
  px: '$xs',
  borderRadius: '$1',
};
