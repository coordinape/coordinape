import { useWindowSize } from '@react-hook/window-size';
import { GiveReceived } from 'features/points/GiveReceived';
import { ThemeContext } from 'features/theming/ThemeProvider';

import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { Flex, Panel, Text } from 'ui';
export const ProfilePageGiveContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const [width, height] = useWindowSize();

  const mainNavWidth = 320;
  const mapWidth = width - mainNavWidth;
  const mapHeight = height - 250;
  const desktop = width > 1140;
  return (
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
              columnWidth: '200px',
              div: {
                py: '$xs',
              },
            },
          }}
        >
          <GiveReceived address={targetAddress} size="large" />
        </Panel>
      </Flex>
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
    </Flex>
  );
};