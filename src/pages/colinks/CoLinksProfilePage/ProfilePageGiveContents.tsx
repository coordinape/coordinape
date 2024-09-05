import { useWindowSize } from '@react-hook/window-size';
import { colinksProfileColumnWidthInt } from 'features/cosoul/constants';
import { CoLinksGiveButton } from 'features/points/CoLinksGiveButton';
import { GiveReceived } from 'features/points/GiveReceived';
import { ThemeContext } from 'features/theming/ThemeProvider';

import { useCoLinksProfile } from 'pages/GiveParty/useCoLinksProfile';
import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { Flex, Panel, Text } from 'ui';

export const profileMainColumnWidth = colinksProfileColumnWidthInt;
export const ProfilePageGiveContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const [width, height] = useWindowSize();

  const gutterWidth = 32;
  const mapWidth =
    width > profileMainColumnWidth
      ? profileMainColumnWidth
      : width - gutterWidth;
  const mapHeight = height - 250;
  const desktop = width > 1140;
  const { data: targetProfile } = useCoLinksProfile(targetAddress);
  return (
    <>
      <GiveReceived address={targetAddress}>
        {receivedNumber =>
          receivedNumber > 0 ? (
            <Flex column css={{ gap: '$sm' }}>
              <Text variant="label">GIVE Received</Text>
              <Flex column>
                <Panel
                  noBorder
                  css={{
                    width: '100%',
                    p: '$sm',
                    '.giveSkillContainer': {
                      width: '100%',
                      display: 'block',
                      columnWidth: '150px',
                      div: {
                        py: '$xs',
                      },
                    },
                  }}
                >
                  <GiveReceived address={targetAddress} size="large" />
                </Panel>
              </Flex>
              <Panel noBorder css={{ p: 0 }}>
                <ThemeContext.Consumer>
                  {({ stitchesTheme }) => (
                    <GiveGraph
                      address={targetAddress}
                      height={mapHeight}
                      width={mapWidth}
                      minZoom={2}
                      expand={desktop}
                      stitchesTheme={stitchesTheme}
                    />
                  )}
                </ThemeContext.Consumer>
              </Panel>
            </Flex>
          ) : (
            <Flex css={{ alignItems: 'flex-start', flexGrow: 1 }}>
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
