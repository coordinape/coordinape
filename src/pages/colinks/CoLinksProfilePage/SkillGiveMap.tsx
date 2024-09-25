import { useWindowSize } from '@react-hook/window-size';
import { NavLogo } from 'features/nav/NavLogo';
import { PointsBarInfo } from 'features/points/PointsBarInfo';
import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink, useParams } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { Eye, X } from 'icons/__generated';
import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { coLinksPaths } from 'routes/paths';
import {
  Button,
  Flex,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from 'ui';

export const SkillGiveMap = () => {
  const { skill } = useParams();
  const [width, height] = useWindowSize();

  if (!skill) {
    return <Flex>Skill query param required</Flex>;
  }
  return (
    <>
      <Flex
        css={{
          gap: '$xl',
          justifyContent: 'space-between',
          background: '$background',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Flex
          column
          css={{
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 2,
            backdropFilter: 'blur(15px)',
          }}
        >
          <Flex
            css={{
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
                to={coLinksPaths.giveSkill(skill)}
                color={'textOnly'}
                css={{ p: 0, svg: { mr: 0 } }}
              >
                <X size={'lg'} />
              </Button>
            </Flex>
          </Flex>
          <Flex
            column
            css={{
              width: `calc(100% - $md)`,
              justifyContent: 'center',
              alignItems: 'center',
              m: ' $sm auto',
              borderRadius: '$3',
              background: 'linear-gradient(90deg, $complete 25%, $cta 80%)',
              p: '$sm',
              color: '$textOnCta',
            }}
          >
            <Text
              h2
              display
              css={{
                ...skillTextStyle,
                color: '$textOnCta',
                pb: '$xs',
                borderBottom: '1px solid $black20',
              }}
            >{`#${skill}`}</Text>
            <Text
              size="small"
              css={{
                m: '$sm 0 $xs',
                height: 'auto',
                color: '$textOnCta',
              }}
            >
              GIVE Map
            </Text>
          </Flex>
        </Flex>
        <ThemeContext.Consumer>
          {({ stitchesTheme }) => (
            <GiveGraph
              skill={skill}
              expand={true}
              width={width}
              height={height}
              stitchesTheme={stitchesTheme}
              zoom={true}
            />
          )}
        </ThemeContext.Consumer>
        <Flex
          column
          css={{
            gap: '$md',
            position: 'absolute',
            bottom: '$lg',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flex css={{ gap: '$sm' }}>
            <Text tag color="cta">
              <Popover>
                <PopoverTrigger css={{ cursor: 'pointer' }}>
                  <Link css={{ fontSize: '$small' }}>What is GIVE?</Link>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  css={{ maxWidth: 300, overflow: 'clip', mx: '$md' }}
                >
                  <PointsBarInfo />
                </PopoverContent>
              </Popover>
            </Text>
          </Flex>
          <Button
            as={NavLink}
            to={coLinksPaths.giveSkill(skill)}
            color={'cta'}
            size={'small'}
            css={{
              p: '$sm $md',
              backdropFilter: 'blur(15px)',
              textTransform: 'capitalize',
            }}
          >
            <Eye /> View {skill} Data
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
