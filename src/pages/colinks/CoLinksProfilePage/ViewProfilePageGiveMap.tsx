import { useWindowSize } from '@react-hook/window-size';
import { NavLogo } from 'features/nav/NavLogo';
import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink, useParams } from 'react-router-dom';

import { X } from 'icons/__generated';
import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Text } from 'ui';

import { ProfileAvatarAndName } from './ProfileAvatarAndName';

export const ViewProfilePageGiveMap = () => {
  const { address } = useParams();
  const [width, height] = useWindowSize();

  if (!address) {
    return <Flex>address query param required</Flex>;
  }
  return (
    <>
      <Flex
        css={{
          gap: '$xl',
          justifyContent: 'space-between',
          background: '$surface',
          outline: '2px solid gold',
          height: '100vh',
        }}
      >
        <Flex
          css={{
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            borderBottom: '0.5px solid $border',
            zIndex: 2,
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            p: '$sm',
            justifyContent: 'space-between',
          }}
        >
          <Flex css={{ gap: '$md' }}>
            <NavLogo />
          </Flex>
          <Flex
            css={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              as={NavLink}
              to={coLinksPaths.profileGive(address)}
              color={'textOnly'}
              css={{ p: 0, svg: { mr: 0 } }}
            >
              <X size={'lg'} />
            </Button>
          </Flex>
        </Flex>
        <ThemeContext.Consumer>
          {({ stitchesTheme }) => (
            <GiveGraph
              address={address}
              minZoom={2}
              expand={true}
              width={width}
              height={height}
              stitchesTheme={stitchesTheme}
              zoom={true}
              compact={false}
            />
          )}
        </ThemeContext.Consumer>
        <Flex
          column
          css={{
            gap: '$sm',
            position: 'absolute',
            bottom: '$lg',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text tag color="cta">
            GIVE Map
          </Text>
          <Button
            as={NavLink}
            to={coLinksPaths.profileGive(address)}
            color={'cta'}
            size={'small'}
            css={{ p: '$sm $md', backdropFilter: 'blur(15px)' }}
          >
            <ProfileAvatarAndName targetAddress={address} />
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
