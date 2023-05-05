import { useEffect, useState } from 'react';

import { useLoginData } from 'features/auth';
import { rotate } from 'keyframes';
import { member_epoch_pgives_select_column } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
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
import { numberWithCommas } from 'utils';

const QUERY_KEY_COSOUL_PAGE = 'cosoulPageQuery';

export const MintPage = () => {
  const profile = useLoginData();

  const address = profile?.address;
  const profileId = profile?.id;

  const { data: cosoul_data } = useQuery(
    [QUERY_KEY_COSOUL_PAGE, profileId],
    async () => {
      const {
        totalPgive,
        totalGive,
        epochCount,
        organizationCount,
        circleCount,
        organizations,
        circles,
        noteCount,
        contributionCount,
      } = await client.query(
        {
          __alias: {
            totalPgive: {
              member_epoch_pgives_aggregate: [
                {
                  where: {
                    user: { profile: { address: { _eq: address } } },
                  },
                },
                // what is the diff between pgive and normalized_pgive.
                // I thought pgive was normalized give, plus stuff
                { aggregate: { sum: [{}, { normalized_pgive: true }] } },
              ],
            },
            totalGive: {
              member_epoch_pgives_aggregate: [
                {
                  where: {
                    user: { profile: { address: { _eq: address } } },
                  },
                },
                // what is the diff between pgive and normalized_pgive.
                // I thought pgive was normalized give, plus stuff
                { aggregate: { sum: [{}, { gives_received: true }] } },
              ],
            },
            epochCount: {
              member_epoch_pgives_aggregate: [
                {
                  where: {
                    user: { profile: { address: { _eq: address } } },
                  },
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
            organizationCount: {
              member_epoch_pgives_aggregate: [
                {
                  where: {
                    user: { profile: { address: { _eq: address } } },
                  },
                  distinct_on: [
                    member_epoch_pgives_select_column.organization_id,
                  ],
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
            circleCount: {
              member_epoch_pgives_aggregate: [
                {
                  where: {
                    user: { profile: { address: { _eq: address } } },
                  },
                  distinct_on: [member_epoch_pgives_select_column.circle_id],
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
            organizations: {
              member_epoch_pgives: [
                {
                  where: {
                    user: { profile: { address: { _eq: address } } },
                  },
                  distinct_on: [
                    member_epoch_pgives_select_column.organization_id,
                  ],
                },
                {
                  organization: {
                    id: true,
                    name: true,
                    logo: true,
                  },
                },
              ],
            },
            circles: {
              member_circle_pgives: [
                {
                  where: {
                    user: { profile: { address: { _eq: address } } },
                  },
                },
                {
                  circle: {
                    id: true,
                    name: true,
                    organization_id: true,
                  },
                  pgive: true,
                  epochs: true,
                },
              ],
            },
            noteCount: {
              note_count: [
                {
                  where: {
                    profile_id: { _eq: profileId },
                  },
                },
                { notes: true },
              ],
            },
            contributionCount: {
              contribution_count: [
                {
                  where: {
                    profile_id: { _eq: profileId },
                  },
                },
                { contributions: true },
              ],
            },
          },
        },
        { operationName: 'getMembersEpochPgives' }
      );

      const orgs = organizations.map(o => o.organization);
      const orgRollup: Record<
        number,
        typeof orgs[number] & {
          circles: {
            name: string;
            pgive: number;
            id: number;
            epochs: number;
          }[];
        }
      > = {};
      for (const org of orgs) {
        if (!org) {
          continue;
        }
        orgRollup[org.id] = { ...org, circles: [] };
      }
      for (const circle of circles) {
        if (!circle.circle) {
          continue;
        }
        const o = orgRollup[circle.circle.organization_id];
        if (!o) {
          continue;
        }
        o.circles.push({
          ...circle.circle,
          pgive: circle.pgive,
          epochs: circle.epochs,
        });
      }
      const orgArray = Object.values(orgRollup).sort((a, b) =>
        a.name > b.name ? -1 : 1
      );

      return {
        // FIXME as any, wut?
        totalPgive: (totalPgive.aggregate?.sum as any).normalized_pgive,
        totalGive: (totalGive.aggregate?.sum as any).gives_received,
        epochCount: epochCount.aggregate?.count,
        organizationCount: organizationCount.aggregate?.count,
        circleCount: circleCount.aggregate?.count,
        organizations: orgArray,
        noteCount: noteCount[0]?.notes ?? 0,
        contributionCount: contributionCount[0]?.contributions ?? 0,
      };
    }
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ cosoul_data });
  });
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
              {numberWithCommas(cosoul_data?.totalPgive, 0)} Public GIVE
            </Text>
            <Text color="secondary">
              pGIVE is an abstraction of the GIVE you have received in
              Coordinape
            </Text>
          </Flex>
          <Flex column css={{ gap: '$md' }}>
            <Button color="cta" size="large" as={NavLink} to={paths.cosoul}>
              Sync Your CoSoul
            </Button>
            <Text color="secondary">
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
              <Text className="nodeHeader">
                {numberWithCommas(cosoul_data?.totalGive, 0)}
              </Text>
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
              <Text className="nodeHeader">
                {cosoul_data?.organizationCount}
              </Text>
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
              <Text className="nodeHeader">{cosoul_data?.circleCount}</Text>
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
              <Text className="nodeHeader">
                {cosoul_data?.contributionCount}
              </Text>
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
              <Text className="nodeHeader">{cosoul_data?.noteCount}</Text>
              <Text className="nodeSubHeader">Notes received</Text>
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
              <Text className="nodeHeader">
                {numberWithCommas(cosoul_data?.epochCount, 0)}
              </Text>
              <Text className="nodeSubHeader">Active epochs</Text>
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
              {cosoul_data?.organizations?.map(org => {
                return (
                  <Box key={org?.id} css={{ mb: '$1xl' }}>
                    <Text
                      h1
                      color="cta"
                      css={{
                        pl: '$sm',
                        pb: '$md',
                        borderBottom: '1px solid $borderFocus',
                      }}
                    >
                      {org?.name}
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
                            epochs
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {org?.circles.map(circle => {
                          return (
                            <tr key={circle.id}>
                              <td>{circle.name}</td>
                              <td>{Math.floor(circle.pgive)}</td>
                              <td className="highlight">
                                {Math.floor(
                                  (circle.pgive / cosoul_data.totalPgive) * 100
                                )}
                                %
                              </td>
                              <td>{circle.epochs}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Box>
                );
              })}
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
