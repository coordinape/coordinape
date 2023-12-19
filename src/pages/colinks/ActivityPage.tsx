import { useContext, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';
import { isMacBrowser } from 'features/SearchBox/SearchBox';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ActivityList } from '../../features/activities/ActivityList';
import { CoLinksContext } from '../../features/colinks/CoLinksContext';
import { PostForm, PROMPTS } from '../../features/colinks/PostForm';
import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
import { RightColumnSection } from '../../features/colinks/RightColumnSection';
import { SimilarProfiles } from '../../features/colinks/SimilarProfiles';
import { useCoLinks } from '../../features/colinks/useCoLinks';
import { QUERY_KEY_COLINKS } from '../../features/colinks/wizard/CoLinksWizard';
import {
  BarChart,
  HouseFill,
  PlanetFill,
  UserFill,
} from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, ContentHeader, Flex, Panel, Text } from '../../ui';
import { TwoColumnSmallRightLayout } from '../../ui/layouts';

import { CoLinksTaskCards } from './CoLinksTaskCards';

export const ActivityPage = () => {
  const { coLinks, address } = useContext(CoLinksContext);
  if (!coLinks || !address) {
    return <LoadingIndicator />;
  }

  return (
    <CoLinksActivityPageContents
      coLinks={coLinks}
      currentUserAddress={address}
    />
  );
};

const CoLinksActivityPageContents = ({
  coLinks,
  currentUserAddress,
}: {
  coLinks: CoLinks;
  currentUserAddress: string;
}) => {
  const [showLoading, setShowLoading] = useState(false);

  const { targetBalance } = useCoLinks({
    contract: coLinks,
    address: currentUserAddress,
    target: currentUserAddress,
  });

  const [promptOffset, setPromptOffset] = useState(0);
  const bumpPromptOffset = () => {
    setPromptOffset(prev => prev + 1);
  };

  return (
    <TwoColumnSmallRightLayout
      css={{
        '@xs': {
          gap: '0',
        },
      }}
    >
      <Flex
        css={{
          gap: '$xl',
          '@xs': {
            gap: '0',
          },
        }}
        column
      >
        <ContentHeader>
          <Flex
            column
            css={{
              flexGrow: 1,
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {targetBalance !== undefined && targetBalance > 0 && (
              <PostForm
                label={
                  <Text size={'medium'} semibold color={'heading'}>
                    {currentPrompt(promptOffset)}
                  </Text>
                }
                showLoading={showLoading}
                onSave={() => setShowLoading(true)}
                refreshPrompt={bumpPromptOffset}
              />
            )}
          </Flex>
        </ContentHeader>
        <Flex column css={{ gap: '$1xl' }}>
          <ActivityList
            queryKey={[QUERY_KEY_COLINKS, 'activity']}
            where={{ private_stream: { _eq: true } }}
            onSettled={() => setShowLoading(false)}
            noPosts={<NoPostsMessage />}
          />
        </Flex>
      </Flex>
      <Flex
        column
        css={{
          gap: '$lg',
          '@xs': {
            display: 'none',
          },
        }}
      >
        <CoLinksTaskCards currentUserAddress={currentUserAddress} small />
        <RightColumnSection
          title={
            <Flex as={AppLink} to={coLinksPaths.linking}>
              <Text color={'default'} semibold>
                <BarChart /> Recent Linking Activity
              </Text>
            </Flex>
          }
        >
          <RecentCoLinkTransactions limit={5} />
        </RightColumnSection>
        <SimilarProfiles address={currentUserAddress} />
      </Flex>
    </TwoColumnSmallRightLayout>
  );
};

const NoPostsMessage = () => {
  return (
    <>
      <Panel
        css={{
          border: 'none',
          flexDirection: 'column',
          p: '0',
          overflow: 'clip',
          alignItems: 'center',
        }}
      >
        <Flex
          className="art"
          css={{
            flexGrow: 1,
            width: '100%',
            minHeight: '260px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage: "url('/imgs/background/colink-welcome.jpg')",
            backgroundPosition: 'bottom',
          }}
        />
        <Flex
          column
          css={{
            flex: 2,
            gap: '$sm',
            alignItems: 'flex-start',
            p: '$lg $md',
            color: '$text',
            'svg path': {
              fill: 'currentColor',
            },
          }}
        >
          <Text h2>Welcome to CoLinks!</Text>
          <Text p as="p">
            <AppLink
              to={coLinksPaths.home}
              css={{
                mr: '$xs',
                gap: '$xs',
                fontWeight: '$semibold',
                display: 'inline',
                whiteSpace: 'nowrap',
              }}
            >
              <HouseFill nostroke css={{ mt: '-3px' }} /> Home
            </AppLink>{' '}
            is where you can see all your posts and the
            <Text inline semibold css={{ mx: '$xs' }}>
              posts made by the people you are linked with.
            </Text>
          </Text>
          <Text p as="p">
            You find and link with people by{' '}
            <Text semibold inline>
              purchasing their link
            </Text>{' '}
            on the{' '}
            <AppLink
              to={coLinksPaths.explore}
              css={{
                gap: '$xs',
                fontWeight: '$semibold',
                display: 'inline',
                whiteSpace: 'nowrap',
              }}
            >
              <PlanetFill nostroke css={{ mt: '-2px' }} /> Explore page
            </AppLink>
            . When you buy someone&apos;s link you will see their posts and they
            will see your posts.
          </Text>
          <Text p as="p">
            Boost your rep by connecting web2 accounts, and add skills &
            interests when you{' '}
            <AppLink
              to={coLinksPaths.explore}
              css={{
                mr: '$xs',
                gap: '$xs',
                fontWeight: '$semibold',
                display: 'inline',
                whiteSpace: 'nowrap',
              }}
            >
              <UserFill nostroke css={{ mt: '-3px' }} /> Edit Your Profile
            </AppLink>{' '}
          </Text>
          <Text p as="p">
            <Text inline>Search for anything with </Text>
            <Text inline semibold>
              {isMacBrowser() ? '⌘' : 'Ctrl-'}K
            </Text>
          </Text>
          <Text p as="p">
            We&apos;re glad you&apos;re here!
          </Text>
        </Flex>
      </Panel>
    </>
  );
};

export const currentPrompt = (offset: number) => {
  return PROMPTS[(new Date().getMinutes() + offset) % PROMPTS.length];
};
