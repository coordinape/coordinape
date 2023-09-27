import { useAuthStateMachine } from 'features/auth/RequireAuth';
import { sync } from 'keyframes';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { CosoulData } from '../../../api/cosoul/[address]';
import isFeatureEnabled from 'config/features';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Box, Button, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { QUERY_KEY_COSOUL_VIEW } from './ViewPage';

export const SplashPage = () => {
  useAuthStateMachine(false, false);
  const address = useConnectedAddress();

  const { data } = useQuery(
    [QUERY_KEY_COSOUL_VIEW, address],
    async (): Promise<CosoulData> => {
      const res = await fetch('/api/cosoul/' + address);
      if (!res.ok) {
        throw new Error('Failed to fetch cosoul data');
      }
      return res.json();
    },
    {
      enabled: !!address,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <Box css={{ position: 'relative' }}>
      <Box
        css={{
          position: 'absolute',
          top: '-120px',
          left: 0,
          height: '1300px',
          width: '100%',
          backgroundImage: "url('/imgs/background/cosoul-field.png')",
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
          zIndex: '-1',
        }}
      ></Box>
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
                color: '$linkHover',
                borderBottom: '1px solid $linkHover',
                pb: '$xs',
                mb: '$sm',
                mt: '$3xl',
              }}
            >
              CoSoul
            </Text>
            <Text h1 display color="cta">
              Bring your GIVE onchain
            </Text>
          </Flex>
          <Text h2 display color="secondary" css={{ maxWidth: '20em' }}>
            CoSoul is a SoulBound NFT that grants you access and reputation into
            untold web3 worlds!
          </Text>
          <Flex css={{ mt: '$lg', gap: '$md' }}>
            {address ? (
              <Flex css={{ gap: '$sm' }}>
                {data?.mintInfo ? (
                  <>
                    <Button
                      as={NavLink}
                      to={paths.cosoulView(address)}
                      color="cta"
                      size="large"
                    >
                      View Your CoSoul
                    </Button>
                    <Button
                      as={NavLink}
                      to={paths.mint}
                      color="transparent"
                      size="large"
                      css={{ px: '$md', color: '$neutral' }}
                    >
                      Manage Your CoSoul
                    </Button>
                  </>
                ) : (
                  <Button as={NavLink} to={paths.mint} color="cta" size="large">
                    Mint Your CoSoul
                  </Button>
                )}
              </Flex>
            ) : (
              <Button as={NavLink} to={paths.mint} color="cta" size="large">
                Connect to Mint CoSoul
              </Button>
            )}
          </Flex>
        </Flex>
        <Flex
          column
          css={{
            '@sm': { maxWidth: '500px', margin: 'auto' },
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
            <Box>
              <img
                src={'/imgs/background/cosoul-composition.png'}
                alt="cosoul composition"
              />
            </Box>
            <Text
              h2
              display
              color="secondary"
              css={{
                maxWidth: '15em',
                fontWeight: '$base',
                display: 'inline',
                '@sm': {
                  maxWidth: 'none',
                },
              }}
            >
              With CoSoul, you can
              <Text h1 display color="cta" css={{ display: 'inline-flex' }}>
                collect attributes
              </Text>{' '}
              earned through real-world web3 collaboration, starting with Public
              GIVE, an aggregation score of your experience in Coordinape.
            </Text>
          </Flex>
          <Box
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr',
              gridGap: 0,
              alignItems: 'center',
              '@sm': {
                display: 'flex',
                flexDirection: 'column',
                gap: '$1xl',
                mb: '$3xl',
              },
            }}
          >
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
              Each month, your CoSoul will{' '}
              <Text h1 display color="cta" css={{ display: 'inline-flex' }}>
                sync with Coordinape
              </Text>{' '}
              data to bring your work history on chain, as public element of
              your future of work persona.
            </Text>
            <Box
              css={{
                position: 'relative',
                background: '$cta',
                overflow: 'hidden',
                zIndex: -1,
                scale: 1.2,
                '@sm': {
                  scale: 1.5,
                },
                '.lines': {
                  position: 'relative',
                  zIndex: 1,
                  scale: 1.01,
                },
              }}
            >
              <img
                className="lines"
                src={'/imgs/background/cosoul-sync.png'}
                alt="cosoul sync"
              />
              <Box
                css={{
                  position: 'absolute',
                  zIndex: 0,
                  background: '$neutral ',
                  width: '100%',
                  height: '100%',
                  border: '130px solid $ctaDim ',
                  // border: '70px solid $secondary ',
                  borderRadius: '$round',
                  animation: `${sync} 2s ease-in-out`,
                  animationIterationCount: 'infinite',
                  top: 0,
                }}
              ></Box>
            </Box>
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
                outline: '4px solid $surface',
                maxWidth: '500px',
              }}
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                src="/imgs/background/cosoul-evolve.mov"
              />
            </Box>
            <Text
              h2
              display
              color="secondary"
              css={{
                maxWidth: '14em',
                fontWeight: '$base',
                display: 'inline',
                '@sm': {
                  maxWidth: 'none',
                },
              }}
            >
              Your unique CoSoul will reveal its shape when you mint. Every soul
              is a deterministic generative work of{' '}
              <Text h1 display color="cta" css={{ display: 'inline-flex' }}>
                art that evolves
              </Text>{' '}
              in intricacy as you grow your experience and skillset.
            </Text>
          </Box>
          <Flex column alignItems="center" css={{ my: '$4xl', gap: '$md' }}>
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
              Mint your CoSoul today and unlock the next step in your web3
              journey.
            </Text>
            <Flex css={{ mt: '$lg', gap: '$md' }}>
              {address ? (
                <Button as={NavLink} to={paths.mint} color="cta" size="large">
                  {data?.mintInfo ? 'View Your CoSoul' : 'Mint CoSoul'}
                </Button>
              ) : (
                <Button as={NavLink} to={paths.mint} color="cta" size="large">
                  Connect to Mint CoSoul
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
                'radial-gradient(circle at bottom, #202414 0%, #070707 65%)',
            }}
          />
        </Flex>
      </SingleColumnLayout>
    </Box>
  );
};
