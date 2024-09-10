import { useWindowSize } from '@react-hook/window-size';
import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink, useParams } from 'react-router-dom';

import { Eye } from 'icons/__generated';
import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Panel } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileHeader } from './ProfileHeader';

export const ViewProfilePageGiveMap = () => {
  const { address } = useParams();
  const [width, height] = useWindowSize();

  const gutterWidth = 32;
  const desktop = width > 960;
  const mapWidth = desktop ? width - 400 : width - gutterWidth;
  const mapHeight = height - 180;

  if (!address) {
    return <Flex>address query param required</Flex>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <Flex css={{ gap: '$xl', justifyContent: 'space-between' }}>
        <Panel noBorder css={{ p: 0, position: 'relative' }}>
          <ThemeContext.Consumer>
            {({ stitchesTheme }) => (
              <GiveGraph
                address={address}
                height={mapHeight}
                width={mapWidth}
                minZoom={2}
                expand={true}
                stitchesTheme={stitchesTheme}
                zoom={true}
                compact={false}
              />
            )}
          </ThemeContext.Consumer>
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
              to={coLinksPaths.profileGive(address)}
              color={'cta'}
              size="xs"
            >
              <Eye />
              View Profile
            </Button>
          </Flex>
        </Panel>
      </Flex>
    </SingleColumnLayout>
  );
};
