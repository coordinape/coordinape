import { useState } from 'react';

import { OtherGiveSkills } from 'features/HomeCards/OtherGiveSkills';
import { TopGiveSkills } from 'features/HomeCards/TopGiveSkills';
import { TopReceivers } from 'features/HomeCards/TopReceivers';
import { TopSenders } from 'features/HomeCards/TopSenders';
import { gradientFlow } from 'keyframes';
import { Helmet } from 'react-helmet';

import { MostLikedCasts } from '../features/HomeCards/MostLikedCasts';
import { Button, Flex, Link, Modal, Panel, Text } from '../ui';
import { CoCircle } from 'icons/__generated';
import { EXTERNAL_URL_CO_DAO } from 'routes/paths';

import { CoAgentCard } from './colinks/give/CoAgentCard';
import { GiveBotCard } from './colinks/give/GiveBotCard';
import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { GivePartyCard } from './colinks/give/GivePartyCard';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';
import { GiveLeaderboardNav } from './GiveLeaderboardNav';

export const QUERY_KEY_GIVE_HOME = 'giveHome';

export const GiveHomePage = () => {
  return (
    <Flex column css={{ '@xs': { gap: 0 } }}>
      <Helmet>
        <title>Home / Coordinape</title>
      </Helmet>
      <GiveHomeHeader />
      <FancyHeader />
      <ResponsiveColumnLayout
        css={{
          '@xs': {
            px: '0 !important',
          },
        }}
      >
        <Flex
          column
          css={{
            mb: '$4xl',
            gap: '$sm',
            '@sm': {
              margin: 'auto',
              gap: 0,
            },
          }}
        >
          <Flex column css={{ maxWidth: '$maxMobile !important' }}>
            <Panel
              noBorder
              css={{
                backgroundSize: '10px 10px',
                backgroundImage:
                  'repeating-linear-gradient(45deg, $borderDimmer 0, $borderDimmer 1.5px, $background 0, $background 50%)',
                alignItems: 'center',
              }}
            >
              <Text
                tag
                css={{
                  mb: '$md',
                  px: '$md',
                  background: '$background',
                  color: '$link',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '$linkHover',
                  },
                  display: 'none',
                  '@xs': { display: 'flex' },
                }}
              >
                <LearnAboutGiveCard linkText="What is GIVE?" />
              </Text>
              <TopGiveSkills tier="first" />
            </Panel>
            <TopSenders />
            <Panel
              noBorder
              css={{
                backgroundSize: '10px 10px',
                backgroundImage:
                  'repeating-linear-gradient(45deg, $borderDimmer 0, $borderDimmer 1.5px, $background 0, $background 50%)',
                border: '0.5px dotted $borderDimmer',
              }}
            >
              <TopGiveSkills tier="second" />
            </Panel>
            <TopReceivers />
            <Panel
              noBorder
              css={{
                backgroundSize: '10px 10px',
                backgroundImage:
                  'repeating-linear-gradient(135deg, $borderDimmer 0, $borderDimmer 2px, $background 0, $background 50%)',
                border: '0.5px dotted $borderDimmer',
              }}
            >
              <TopGiveSkills tier="third" />
            </Panel>
            <Panel
              noBorder
              css={{
                background:
                  'radial-gradient(circle at 25% 25%, $borderDimmer 20%, transparent 21%, transparent 100%), radial-gradient(circle at 75% 75%, $borderDimmer 15%, transparent 16%)',
                backgroundSize: '1em 1em',
                border: '0.5px dotted transparent',
              }}
            >
              <OtherGiveSkills skipFirst={3} />
            </Panel>
            <Panel
              noBorder
              css={{
                backgroundSize: '10px 10px',
                backgroundImage:
                  'repeating-linear-gradient(135deg, $borderDimmer 0, $borderDimmer 1.5px, $background 0, $background 50%)',
                border: '0.5px dotted $borderDimmer',
              }}
            >
              <MostLikedCasts />
            </Panel>
          </Flex>
        </Flex>
        <GiveHelpCards />
      </ResponsiveColumnLayout>
    </Flex>
  );
};

export const GiveHelpCards = () => {
  return (
    <>
      <Flex
        column
        css={{
          gap: '$xl',
          maxWidth: '$maxMobile !important',
          margin: '0 auto',
          '@sm': {
            width: '100%',
            px: '$md',
            mb: '$md',
            gap: '$md',
          },
        }}
      >
        <LearnAboutGiveCard />
        <GivePartyCard />
        <GiveBotCard />
        <CoAgentCard />
      </Flex>
    </>
  );
};
export const GiveHomeHeader = () => {
  return (
    <>
      <Flex
        column
        css={{
          m: '$xs 0 $md $xl',
          '@xs': {
            m: 0,
          },
        }}
      >
        <GiveLeaderboardNav />
      </Flex>
    </>
  );
};

const FancyHeader = () => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <>
      <Flex
        css={{
          ml: '$xl',
          mb: '$lg',
          '@sm': {
            width: '100%',
            maxWidth: '$maxMobile',
            m: '$sm auto $lg',
          },

          '@xs': {
            m: 0,
            justifyContent: 'center',
            color: '$textOnCta',
            background: 'linear-gradient(300deg, $complete, $cta, $warning)',
            backgroundSize: '600% 600%',
            animation: `${gradientFlow} 30s ease infinite`,
            alignItems: 'center',
            p: '$1xl $md',
            span: { color: '$textOnCta' },
          },
        }}
      >
        <Flex
          row
          css={{
            alignItems: 'center',
            gap: '$md',
            '@xs': {
              gap: '$sm',
              alignItems: 'flex-start',
            },
          }}
        >
          ICON
          <Text
            h2
            display
            css={{
              display: 'flex',
              alignItems: 'flex-start',
              '@xs': {
                fontSize: '22px',
                flexDirection: 'column',
              },
            }}
          >
            <Text semibold css={{ mr: '$sm' }}>
              The World
            </Text>
            <Text css={{ gap: '$sm' }}>
              <Text inline css={{ fontStyle: 'italic', fontFamily: 'Georgia' }}>
                of
              </Text>{' '}
              <Text semibold>GIVE</Text>
            </Text>
          </Text>
        </Flex>
      </Flex>
      <Modal
        open={modalVisible}
        onOpenChange={setModalVisible}
        closeButtonStyles={{ outline: 'none !important', color: 'white' }}
        css={{
          p: 0,
          border: 'none',
        }}
      >
        <Flex
          css={{
            flexGrow: 1,
            width: '100%',
            minHeight: '400px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover',
            backgroundImage: "url('/imgs/background/co-gem.jpg')",
          }}
        />
        <Flex column css={{ p: '$lg', gap: '$md' }}>
          <Text h2 display css={{ color: '$text', flexWrap: 'wrap' }}>
            <CoCircle
              fa
              size="xl"
              css={{
                mr: '$sm',
                'path:last-child': { fill: 'currentColor !important' },
              }}
            />
            CO Token Is Live!
          </Text>
          <Text h2 inline>
            What&apos;s new in the Coordinape universe...
          </Text>
          <Text h1 inline>
            CoDAO has launched, and the governance and utility token for the
            Social Oracle, CO token, is live!
          </Text>
          <Flex column css={{ gap: '$md', mt: '$md' }}>
            <Button
              as={Link}
              href={EXTERNAL_URL_CO_DAO}
              target="_blank"
              rel="noreferrer"
              size="large"
              color="cta"
            >
              Check it out!
            </Button>
            <Button
              color="secondary"
              size="large"
              onClick={() => {
                setModalVisible(false);
              }}
            >
              Continue to Coordinape app
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
