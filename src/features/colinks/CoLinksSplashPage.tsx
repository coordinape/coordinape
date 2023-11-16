import { useAuthStateMachine } from 'features/auth/RequireAuth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Box, Button, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { QUERY_KEY_COLINKS } from './CoLinksWizard';

export const CoLinksSplashPage = () => {
  useAuthStateMachine(false, false);
  const address = useConnectedAddress();

  const { data: keyData } = useQuery(
    [QUERY_KEY_COLINKS, address, 'splashKey'],
    async () => {
      const { hasOwnKey } = await client.query(
        {
          __alias: {
            hasOwnKey: {
              link_holders: [
                {
                  where: {
                    holder: {
                      _eq: address,
                    },
                    target: {
                      _eq: address,
                    },
                  },
                  limit: 1,
                },
                {
                  amount: true,
                  holder: true,
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_hasOwnKey',
        }
      );
      return {
        hasOwnKey: hasOwnKey[0]?.amount > 0,
      };
    }
  );

  return (
    <Box css={{ position: 'relative' }}>
      <Box
        css={{
          position: 'absolute',
          top: '-120px',
          left: 0,
          height: '1300px',
          width: '100%',
          backgroundImage: "url('/imgs/background/colinks-field.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'calc(50% + 135px) center',
          '@md': {
            top: '-230px',
            backgroundPosition: 'calc(50% + 65px) center',
          },
          '@sm': {
            top: '-320px',
            backgroundPosition: 'calc(50% - 55px) center',
          },
          zIndex: -1,
        }}
      />
      <Box
        css={{
          position: 'absolute',
          top: '1300px',
          left: 0,
          height: '1300px',
          width: '100%',
          // backgroundColor: '$surface',
          mixBlendMode: 'difference',
          backgroundImage:
            "url('/imgs/background/colinks-field-secondary.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'calc(50% + 135px) center',
          '@md': {
            top: '-230px',
            backgroundPosition: 'calc(50% + 65px) center',
          },
          '@sm': {
            top: '-320px',
            backgroundPosition: 'calc(50% - 55px) center',
          },
          zIndex: -1,
        }}
      />
      <SingleColumnLayout
        css={{
          m: 'auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Flex
          column
          alignItems="start"
          css={{
            gap: '$md',
            minHeight: '700px',
            '@sm': {
              minHeight: '600px',
            },
          }}
        >
          <Flex column>
            <Text
              h1
              display
              css={{
                color: '$coLinksCtaDim',
                borderBottom: '1px solid $coLinksCtaDim',
                pb: '$xs',
                mb: '$sm',
                mt: '$3xl',
              }}
            >
              CoLinks
            </Text>
            <Text h1 display color="coLinks">
              Unlock your network &mdash;
              <br />
              Discover your next opportunity
            </Text>
          </Flex>
          <Text h2 display color="secondary" css={{ maxWidth: '20em' }}>
            You&apos;ve been in the arena, trying stuff. It&apos;s time for the
            next generation of professional development and network building,
            empowering you to own your influence and share in the value you
            bring.
          </Text>
          <Flex css={{ mt: '$lg', gap: '$md' }}>
            <Flex css={{ gap: '$sm' }}>
              {keyData?.hasOwnKey ? (
                <Button
                  as={NavLink}
                  to={paths.coLinksHome}
                  color="coLinksCta"
                  size="large"
                >
                  Connect in CoLinks
                </Button>
              ) : (
                <Button
                  as={NavLink}
                  to={paths.coLinksWizardStart}
                  color="coLinksCta"
                  size="large"
                >
                  Get Started
                </Button>
              )}
            </Flex>
          </Flex>
          <Flex column>
            <Text
              h1
              display
              css={{
                color: '$coLinksCtaDim',
                borderBottom: '1px solid $coLinksCta',
                pb: '$xs',
                mb: '$md',
                mt: '$4xl',
              }}
            >
              The SocialFi Platform
              <br />
              for the future of work
            </Text>
            <Text h2 display color="secondary" css={{ maxWidth: '20em' }}>
              Work has changed. Professional networking should keep up with the
              times. Personalized to the individual, with a focus on expanding
              horizons and discovering what&apos;s next, and not confined to one
              place.
            </Text>
          </Flex>
        </Flex>

        <Flex
          column
          css={{
            alignItems: 'center',
            '@sm': { maxWidth: '500px', margin: '$3xl auto 0' },
          }}
        >
          <Flex
            row
            alignItems="center"
            css={{
              gap: '$xl',
              my: '$4xl',
              '@sm': {
                flexDirection: 'column-reverse',
                mb: '$3xl',
                mt: '0',
              },
            }}
          >
            <Box
              css={{
                maxWidth: '500px',
                background: '$surface',
                mixBlendMode: 'difference',
                video: { scale: 1.1 },
              }}
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/colinks-radial.mp4"
              />
            </Box>
            <Flex column css={{ gap: '$sm' }}>
              <Text h1 display color="coLinksCta">
                Discovery, leveled up
              </Text>
              <Text
                h2
                display
                color="secondary"
                css={{
                  maxWidth: '18em',
                  fontWeight: '$base',
                  display: 'inline',
                  '@sm': {
                    maxWidth: 'none',
                  },
                }}
              >
                Browse big brain builders, find your next collaborator,
                employee, or job, or just get advice. As CoLinks grows, AI aided
                discovery will help you share and discover like never before.
              </Text>
            </Flex>
          </Flex>
          <Box
            css={{
              flexDirection: 'row-reverse',
              display: 'flex',
              gridGap: '$xl',
              alignItems: 'center',
              justifyContent: 'center',
              my: '$4xl',
              '@sm': {
                flexDirection: 'column-reverse',
              },
            }}
          >
            <Box
              css={{
                maxWidth: '500px',
                background: '$surface',
                mixBlendMode: 'difference',
                video: { scale: 1.1 },
              }}
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/colinks-5.mp4"
              />
            </Box>
            <Flex column css={{ gap: '$sm' }}>
              <Text h1 display color="coLinksCta">
                If friend.tech and LinkedIn had a baby
              </Text>
              <Text
                h2
                display
                color="secondary"
                css={{
                  maxWidth: '18em',
                  fontWeight: '$base',
                  display: 'inline',
                  '@sm': {
                    maxWidth: 'none',
                  },
                }}
              >
                CoLinks reimagines professional networks: find your partners,
                gather where you find warmth, connect with real humans more
                directly to up-level your career, and share in the value you
                create. Bring your web2 rep onto web3 rails and lfg.
              </Text>
            </Flex>
          </Box>
          <Box
            css={{
              display: 'flex',
              gridGap: '$xl',
              alignItems: 'center',
              justifyContent: 'center',
              my: '$4xl',
              '@sm': {
                flexDirection: 'column-reverse',
              },
            }}
          >
            <Box
              css={{
                maxWidth: '500px',
                background: '$surface',
                mixBlendMode: 'difference',
                video: { scale: 1.1 },
              }}
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/colinks-2.mp4"
              />
            </Box>
            <Flex column css={{ gap: '$sm' }}>
              <Text h1 display color="coLinksCta">
                Show up your way with RepScore™
              </Text>
              <Text
                h2
                display
                color="secondary"
                css={{
                  maxWidth: '18em',
                  fontWeight: '$base',
                  display: 'inline',
                  '@sm': {
                    maxWidth: 'none',
                  },
                }}
              >
                LinkedIn Maxi? CT famous? GitHub God? Pope of POAPs? We gotchu,
                normies and anons alike. Link what you want, your Rep will
                reflect your efforts Invite friends with your referral link and
                further boost your Rep.
              </Text>
            </Flex>
          </Box>
          <Box
            css={{
              flexDirection: 'row-reverse',
              display: 'flex',
              gridGap: '$xl',
              alignItems: 'center',
              justifyContent: 'center',
              my: '$4xl',
              '@sm': {
                flexDirection: 'column-reverse',
              },
            }}
          >
            <Box
              css={{
                maxWidth: '500px',
                background: '$surface',
                mixBlendMode: 'difference',
                video: { scale: 1.1 },
              }}
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/colinks-5.mp4"
              />
            </Box>
            <Flex column css={{ gap: '$sm' }}>
              <Text h1 display color="coLinksCta">
                Enter the SocialFi marketplace with your CoLink
              </Text>
              <Text
                h2
                display
                color="secondary"
                css={{
                  maxWidth: '20em',
                  fontWeight: '$base',
                  display: 'inline',
                  '@sm': {
                    maxWidth: 'none',
                  },
                }}
              >
                Once you buy your CoLink, it enters a dynamic marketplace where
                others can buy it too. As you buy and sell links, you are honing
                a network of real people who care about their interactions.
                Smart contracts automagically share the value of your
                Link&apos;s activity with you.
              </Text>
            </Flex>
          </Box>
          <Box
            css={{
              display: 'flex',
              gridGap: '$xl',
              alignItems: 'center',
              justifyContent: 'center',
              my: '$4xl',
              '@sm': {
                flexDirection: 'column-reverse',
              },
            }}
          >
            <Box
              css={{
                maxWidth: '500px',
                background: '$surface',
                mixBlendMode: 'difference',
                video: { scale: 1.1 },
              }}
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/colinks-2.mp4"
              />
            </Box>
            <Flex column css={{ gap: '$sm' }}>
              <Text h1 display color="coLinksCta">
                Built for what&apos;s next
              </Text>
              <Text
                h2
                display
                color="secondary"
                css={{
                  maxWidth: '18em',
                  fontWeight: '$base',
                  display: 'inline',
                  '@sm': {
                    maxWidth: 'none',
                  },
                }}
              >
                We&apos;ve built hooks to import your rep from legacy platforms
                and reflect your web3 accomplishments, and expansion ports for
                the cool things you&apos;ll do on platforms of the future.
                Everything bubbles up to your CoSoul NFT, so you own your rep
                and can take it where you want, how you want.
              </Text>
            </Flex>
          </Box>
          <Flex column alignItems="center" css={{ my: '$4xl', gap: '$md' }}>
            <Text
              h2
              display
              color="secondary"
              css={{
                maxWidth: '20em',
                textAlign: 'center',
                fontWeight: '$base',
                display: 'inline',
                '@sm': {
                  maxWidth: 'none',
                },
              }}
            >
              Ready to find your people
              <br />
              and your next opportunity?
            </Text>
            <Flex css={{ mt: '$lg', gap: '$md' }}>
              {keyData?.hasOwnKey ? (
                <Button
                  as={NavLink}
                  to={paths.coLinksHome}
                  color="coLinksCta"
                  size="large"
                >
                  Connect in CoLinks
                </Button>
              ) : (
                <Button
                  as={NavLink}
                  to={paths.coLinksWizardStart}
                  color="coLinksCta"
                  size="large"
                >
                  Get Started
                </Button>
              )}
            </Flex>
          </Flex>
          <Box
            css={{
              zIndex: '-1',
              left: '0',
              position: 'absolute',
              width: '100%',
              height: '700px',
              bottom: '-80px',
              background:
                'radial-gradient(circle at bottom, #231424 0%, #070707 65%)',
            }}
          />
        </Flex>
      </SingleColumnLayout>
    </Box>
  );
};
