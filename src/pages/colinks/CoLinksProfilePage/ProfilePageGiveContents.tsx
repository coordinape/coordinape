import { useWindowSize } from '@react-hook/window-size';
import { mapMobileWidthInt } from 'features/cosoul/constants';
import { CoLinksGiveButton } from 'features/points/CoLinksGiveButton';
import { GiveReceived } from 'features/points/GiveReceived';
import { NavLink } from 'react-router-dom';

import { AutosizedGiveGraph } from '../../NetworkViz/AutosizedGiveGraph';
import { Maximize } from 'icons/__generated';
import { useCoLinksProfile } from 'pages/GiveParty/useCoLinksProfile';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Panel, Text } from 'ui';

import { cardMaxWidth } from './ProfileCards';

export const mapMobileWidthWidth = mapMobileWidthInt;
export const ProfilePageGiveContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const [width] = useWindowSize();

  const desktop = width > 1140;
  const mapHeight = desktop ? 450 : 180;

  const { data: targetProfile } = useCoLinksProfile(targetAddress);
  return (
    <>
      <GiveReceived address={targetAddress}>
        {receivedNumber =>
          receivedNumber > 0 ? (
            <Flex column css={{ gap: '$sm', width: '100%' }}>
              <Flex css={{ gap: '$md' }}>
                <GiveReceived address={targetAddress} size="medium" />
              </Flex>
              <Flex
                css={{
                  '@sm': {
                    mr: '-$md',
                    overflow: 'scroll',
                  },
                  '.giveSkillWrapper': {
                    width: '100%',
                    flexDirection: 'column',
                    overflow: 'visible',
                  },
                  '.giveSkillContainer': {
                    background:
                      'linear-gradient(90deg, $complete 25%, $cta 80%)',
                    p: '$sm',
                    borderRadius: '$3',
                    width: '100%',
                    display: 'block',
                    columnWidth: '150px',
                    div: {
                      py: '$xs',
                      flex: '0 1',
                    },
                    '@sm': {
                      background: 'transparent',
                      p: '$sm 0',
                      display: 'flex',
                      flexGrow: 1,
                      flexFlow: 'wrap',
                      // flexWrap: 'wrap',
                      // width: '100%',
                      minHeight: '$1xl',
                      height: '76px',
                      minWidth: '375px',
                      flexDirection: 'column',
                      gap: '$sm',
                      // mx: '$md',
                      div: {
                        py: 0,
                      },
                    },
                  },
                }}
              >
                <GiveReceived address={targetAddress} size="large" />
              </Flex>
              <Panel noBorder css={{ p: 0, position: 'relative' }}>
                <AutosizedGiveGraph
                  mapHeight={mapHeight}
                  expand={false}
                  targetAddress={targetAddress}
                />
                <Flex
                  css={{
                    position: 'absolute',
                    bottom: '$sm',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    as={NavLink}
                    to={coLinksPaths.profileGiveMap(targetAddress)}
                    color={'cta'}
                    size="xs"
                  >
                    <Maximize />
                    Expand GIVE Map
                  </Button>
                </Flex>
              </Panel>
            </Flex>
          ) : (
            <Flex
              column
              css={{
                alignItems: 'flex-start',
                flexGrow: 1,
                gap: '$sm',
                '@sm': {
                  maxWidth: cardMaxWidth,
                  margin: 'auto',
                },
              }}
            >
              <Panel
                noBorder
                css={{
                  p: 0,
                  gap: '$sm',
                  width: '100%',
                  alignItems: 'flex-start',
                  overflow: 'clip',
                }}
              >
                <Flex
                  css={{
                    flexGrow: 1,
                    width: '100%',
                    minHeight: '250px',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundImage: "url('/imgs/background/give-none.jpg')",
                    backgroundPosition: 'top',
                  }}
                />
                <Flex
                  column
                  css={{
                    flex: 2,
                    gap: '$sm',
                    alignItems: 'flex-start',
                    p: '$sm $md $md',
                    color: '$text',
                    'svg path': {
                      fill: 'currentColor',
                    },
                  }}
                >
                  <Text size={'medium'} semibold>
                    {targetProfile?.name} hasn&apos;t received any GIVE
                  </Text>
                  <Text>
                    Be the first to give {targetProfile?.name} a GIVE!
                  </Text>
                  <CoLinksGiveButton
                    cta
                    gives={[]}
                    targetProfileId={targetProfile?.id}
                    targetAddress={targetAddress}
                  />
                </Flex>
              </Panel>
            </Flex>
          )
        }
      </GiveReceived>
    </>
  );
};
