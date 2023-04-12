/* eslint-disable jsx-a11y/media-has-caption */
// import { rotate } from 'keyframes';
import { useState } from 'react';

import { rotate } from 'keyframes';
import { NavLink } from 'react-router-dom';
import { styled } from 'stitches.config';

import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Button,
  Text,
  Panel,
  Box,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const MintPage = () => {
  const [open, setOpen] = useState(false);
  const Table = styled('table', {});
  const artWidthMobile = '320px';
  const artWidth = '500px';
  const nodeWidth = '180px';
  const nodeBorderWidth = '2px';
  const nodeDetails = {
    position: 'static',
    width: '50%',
    mt: '$md',
  };
  const nodeStyle = {
    width: `${nodeWidth}`,
    p: '$sm $sm $md',
    position: 'absolute',
    borderBottom: `${nodeBorderWidth} solid $border `,
    zIndex: -1,
    '.nodeHeader': {
      fontSize: '45px',
      '@md': {
        fontSize: '40px',
      },
      fontWeight: '$semibold',
      color: '$secondaryButtonText',
    },
    '.nodeSubHeader': {
      fontSize: '$small',
      color: '$ctaHover',
    },
    '@sm': {
      ...nodeDetails,
      zIndex: 1,
    },
  };
  const nodeLineStyle = {
    content: '',
    position: 'absolute',
    bottom: `-${nodeBorderWidth}`,
    width: `calc(50vw - (${artWidth} / 2))`,
    maxWidth: `calc(($mediumScreen / 2) - (${artWidth} / 2))`,
    borderBottom: `${nodeBorderWidth} solid $border `,
    '@sm': {
      display: 'none',
    },
  };

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <Box>
      <SingleColumnLayout
        css={{
          m: 'auto',
          alignItems: 'center',
          gap: '$1xl',
          maxWidth: '1200px',
        }}
      >
        <Panel
          css={{
            justifyContent: 'space-between',
            borderColor: '$cta',
            width: '100%',
            minWidth: '180px',
            maxWidth: `${artWidth}`,
            minHeight: `calc(${artWidth} * .6)`,
            gap: '$3xl',
            '@sm': {
              maxWidth: `${artWidthMobile}`,
              height: 'auto',
              gap: '$1xl',
            },
          }}
        >
          <Flex column css={{ gap: '$sm' }}>
            <Text variant="label">{"You've Earned"}</Text>
            <Text h2 display>
              2,345 Public GIVE
            </Text>
            <Text className="nodeSubHeader">
              pGIVE is an abstraction of the GIVE you have received in
              Coordinape
            </Text>
          </Flex>
          <Flex column css={{ gap: '$md' }}>
            <Button color="cta" size="large" as={NavLink} to={paths.cosoul}>
              Sync Your CoSoul
            </Button>
            <Text className="nodeSubHeader">
              There are no fees to mint CoSouls, and gas costs are minimal.
            </Text>
          </Flex>
        </Panel>
        <Flex
          column
          css={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Box
            css={{
              // border: '1px dashed rgba(255, 255, 255, 0.3)',
              // borderRadius: '8px',
              // background: 'black',
              outline: '4px solid $surface',
              position: 'relative',
              width: '100%',
              maxWidth: `${artWidth}`,
              height: `${artWidth}`,
              my: '$lg',
              '@sm': {
                maxWidth: `${artWidthMobile}`,
                height: `${artWidthMobile}`,
              },
              iframe: {
                border: 'none',
                body: {
                  m: 0,
                },
              },
            }}
          >
            <Box
              css={
                {
                  // filter: 'blur(5px)',
                }
              }
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/cosoul-demo.mov"
              />
            </Box>
            <Box
              css={{
                position: 'absolute',
                top: 0,
                zIndex: -1,
                background:
                  'linear-gradient(rgb(198 219 137), rgb(34 119 127))',
                animation: `${rotate} 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%;',
                width: `${artWidth}`,
                height: `${artWidth}`,
                filter: `blur(calc(${artWidth} / 5))`,
                '@sm': {
                  maxWidth: `${artWidthMobile}`,
                  height: `${artWidthMobile}`,
                  filter: `blur(calc(${artWidthMobile} / 5))`,
                },
              }}
            />
            {/* <Text
              color="default"
              semibold
              css={{
                position: 'absolute',
                height: '4rem',
                top: 'calc(50% - 2rem)',
                width: '12rem',
                left: 'calc(50% - 6rem)',
                textAlign: 'center',
                color: '$headingText',
                opacity: 0.7,
                display: 'flex',
                justifyContent: 'center',
                padding: '$sm',
              }}
            >
              CoSoul art will generate after minting
            </Text> */}
          </Box>
          {/* Nodes Container */}
          <Flex
            row
            css={{
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: `${artWidth}`,
              '@sm': {
                background: 'rgba(80,80,80,0.5)',
                mt: '$md',
                p: '0 $md $lg $md',
                borderRadius: '$3',
              },
            }}
          >
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                bottom: 'calc(100% - 40px)',
                left: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '100%',
                  rotate: '15deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              <Text className="nodeHeader">2,300</Text>
              <Text className="nodeSubHeader">GIVE Received</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                bottom: 'calc(100% - 40px)',
                right: 0,
                '&:after': {
                  ...nodeLineStyle,
                  right: '100%',
                  rotate: '-15deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              <Text className="nodeHeader">2</Text>
              <Text className="nodeSubHeader">Organizations</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                right: 0,
                bottom: '50%',
                '&:after': {
                  ...nodeLineStyle,
                  right: '99.5%',
                  rotate: '-5deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              <Text className="nodeHeader">3</Text>
              <Text className="nodeSubHeader">Circles</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                right: 0,
                bottom: 0,
                '&:after': {
                  ...nodeLineStyle,
                  right: '99.5%',
                  rotate: '15deg',
                  transformOrigin: '100% 0',
                },
              }}
            >
              <Text className="nodeHeader">234</Text>
              <Text className="nodeSubHeader">Contributions</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                left: 0,
                bottom: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '99.5%',
                  rotate: '-15deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              <Text className="nodeHeader">180</Text>
              <Text className="nodeSubHeader">Notes</Text>
            </Box>
            {/* Node */}
            <Box
              css={{
                ...nodeStyle,
                bottom: '50%',
                left: 0,
                '&:after': {
                  ...nodeLineStyle,
                  left: '99.5%',
                  rotate: '5deg',
                  transformOrigin: '0 0',
                },
              }}
            >
              <Text className="nodeHeader">25</Text>
              <Text className="nodeSubHeader">Active months</Text>
            </Box>
          </Flex>
        </Flex>
        <Box
          css={{
            width: '100%',
            maxWidth: `${artWidth}`,
            mb: '$4xl',
            pb: '$lg',
          }}
        >
          <Collapsible open={open} onOpenChange={setOpen} css={{ mb: '$md' }}>
            <CollapsibleContent>
              <Text h2 css={{ color: '$neutral', pb: '$md' }}>
                pGIVE Composition Detail
              </Text>
              {/* Org 1 */}
              <Box css={{ mb: '$1xl' }}>
                <Text
                  h1
                  color="cta"
                  css={{
                    pl: '$sm',
                    pb: '$md',
                    borderBottom: '1px solid $borderFocus',
                  }}
                >
                  Alpha Org
                </Text>
                <Table
                  css={{
                    width: '100%',
                    borderSpacing: 0,
                    fontSize: '$small',
                    tableLayout: 'fixed',
                    'td, th': {
                      p: '$sm',
                      borderBottom: '1px solid $borderTable',
                      textAlign: 'left',
                      verticalAlign: 'baseline',
                    },
                    th: {
                      color: '$secondaryText',
                      textTransform: 'uppercase',
                    },
                    td: {
                      fontWeight: '$semibold',
                      color: '$secondaryText',
                    },
                    '.highlight': {
                      color: '$cta',
                    },
                  }}
                >
                  <thead>
                    <tr>
                      <th>
                        Circle <br />
                        Name
                      </th>
                      <th>
                        Public <br />
                        GIVE
                      </th>
                      <th>
                        % of Total <br />
                        Public GIVE
                      </th>
                      <th>
                        Active <br />
                        months
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Core</td>
                      <td>300</td>
                      <td className="highlight">10%</td>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>TestKyklos</td>
                      <td>45</td>
                      <td className="highlight">3%</td>
                      <td>15</td>
                    </tr>
                  </tbody>
                </Table>
              </Box>
              {/* Org 2 */}
              <Box css={{ mb: '$1xl' }}>
                <Text
                  h1
                  color="cta"
                  css={{
                    pl: '$sm',
                    pb: '$md',
                    borderBottom: '1px solid $borderFocus',
                  }}
                >
                  PartyPlannen
                </Text>
                <Table
                  css={{
                    width: '100%',
                    borderSpacing: 0,
                    fontSize: '$small',
                    tableLayout: 'fixed',
                    'td, th': {
                      p: '$sm',
                      borderBottom: '1px solid $borderTable',
                      textAlign: 'left',
                      verticalAlign: 'baseline',
                    },
                    th: {
                      color: '$secondaryText',
                      textTransform: 'uppercase',
                    },
                    td: {
                      fontWeight: '$semibold',
                      color: '$secondaryText',
                    },
                    '.highlight': {
                      color: '$cta',
                    },
                  }}
                >
                  <thead>
                    <tr>
                      <th>
                        Circle <br />
                        Name
                      </th>
                      <th>
                        Public <br />
                        GIVE
                      </th>
                      <th>
                        % of Total <br />
                        Public GIVE
                      </th>
                      <th>
                        Active <br />
                        months
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ragers</td>
                      <td>2,000</td>
                      <td className="highlight">67%</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </Table>
              </Box>
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button fullWidth css={{ mb: '$md' }}>
                {!open ? 'Show pGIVE composition details' : 'Hide details'}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </Box>
      </SingleColumnLayout>
    </Box>
  );
};
