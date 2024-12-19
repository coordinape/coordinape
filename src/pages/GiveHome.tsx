import { OtherGiveSkills } from 'features/HomeCards/OtherGiveSkills';
import { TopGiveSkills } from 'features/HomeCards/TopGiveSkills';
import { TopReceivers } from 'features/HomeCards/TopReceivers';
import { TopSenders } from 'features/HomeCards/TopSenders';
import { gradientFlow } from 'keyframes';
import { Helmet } from 'react-helmet';

import { MostLikedCasts } from '../features/HomeCards/MostLikedCasts';
import { Flex, Panel, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';
import { GemCoOutline } from 'icons/__generated';

import { GiveBotCard } from './colinks/give/GiveBotCard';
import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { GivePartyCard } from './colinks/give/GivePartyCard';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';
import { GiveLeaderboardNav } from './GiveLeaderboardNav';

export const QUERY_KEY_GIVE_HOME = 'giveHome';

export const GiveHomePage = () => {
  return (
    <SingleColumnLayout
      css={{ p: '0 !important', maxWidth: 'none', '@xs': { gap: 0 } }}
    >
      <Helmet>
        <title>Home / Coordinape</title>
      </Helmet>

      <Flex
        column
        css={{
          gap: '$xs',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Flex
          column
          css={{
            flexGrow: 1,
            width: '100%',
            gap: '$xs',
            p: '$xl $xl',
            color: '$text',
            borderBottom: '1px solid $border',
            mb: '$md',
            '@xs': {
              color: '$textOnCta',
              background: 'linear-gradient(300deg, $complete, $cta, $warning)',
              backgroundSize: '600% 600%',
              animation: `${gradientFlow} 30s ease infinite`,
              alignItems: 'center',
              p: '$1xl $md',
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
            <GemCoOutline fa size="2xl" css={{ mt: '$xs' }} />
            <Text
              semibold
              css={{
                display: 'flex',
                alignItems: 'flex-start',
                fontSize: '36px',
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
                <Text
                  inline
                  css={{ fontStyle: 'italic', fontFamily: 'Georgia' }}
                >
                  of
                </Text>{' '}
                <Text semibold>GIVE</Text>
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex css={{ m: '-$xl 0 0 $xl' }}>
        <GiveLeaderboardNav />
      </Flex>

      <ResponsiveColumnLayout
        css={{
          mt: '$sm',
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
        <Flex
          column
          css={{
            gap: '$xl',
            flexGrow: 1,
            '@sm': {
              flexDirection: 'row',
              gap: '$sm',
              pb: '$sm',
              mt: '$lg',
              overflow: 'scroll',
              mx: '-$md',
              px: '$md',
            },
          }}
        >
          <LearnAboutGiveCard />
          <GivePartyCard />
          <GiveBotCard />
        </Flex>
      </ResponsiveColumnLayout>
    </SingleColumnLayout>
  );
};
