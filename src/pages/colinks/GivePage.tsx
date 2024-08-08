import { Helmet } from 'react-helmet';

import { PointsBar } from '../../features/points/PointsBar';
import { PartySearchBox } from '../../features/SearchBox/PartySearchBox';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Button, ContentHeader, Flex, Panel, Text } from '../../ui';
import {
  SingleColumnLayout,
  TwoColumnSmallRightLayout,
} from '../../ui/layouts';
import { GiveLeaderboard } from '../GiveLeaderboard';

export const GivePage = () => {
  return (
    <Flex column>
      <SingleColumnLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <Helmet>
          <title>GIVE / CoLinks</title>
        </Helmet>
        <ContentHeader>
          <Flex
            css={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Flex column css={{ gap: '$md' }}>
              <Text h2 display>
                GIVE
              </Text>
              <Text>
                Give is a bla bla thing and its really great you should do it
                too!!!!
              </Text>
              <PartySearchBox size={'large'} registerKeyDown={false} />
            </Flex>
          </Flex>
        </ContentHeader>
      </SingleColumnLayout>
      <TwoColumnSmallRightLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <GiveLeaderboard />
        <Flex column css={{ gap: '$xl' }}>
          <PointsBar />
          <LearnCard
            title="Give bot is a thing"
            message="you can reply to casts to give"
            buttonTitle={'learn how to use Give Bot'}
          />
          <LearnCard
            title="Give bot is a thing"
            message="you can reply to casts to give"
            buttonTitle={'learn how to use Give Bot'}
          />
          <LearnCard
            title="Give bot is a thing"
            message="you can reply to casts to give"
            buttonTitle={'learn how to use Give Bot'}
          />
        </Flex>
      </TwoColumnSmallRightLayout>
    </Flex>
  );
};

const LearnCard = ({
  small = true,
  title,
  message,
  buttonTitle,
}: {
  small?: boolean;
  title: string;
  message: string;
  buttonTitle: string;
}) => {
  const panelStyles = {
    border: 'none',
    flexDirection: small ? 'column' : 'row',
    p: small ? '0' : '0 $md 0 0',
    overflow: 'clip',
    alignItems: 'center',
    gap: small ? '0' : '$lg',
  };
  const artStyles = {
    flexGrow: 1,
    height: '100%',
    width: small ? '100%' : 'auto',
    minHeight: '180px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };
  const copyContainerStyles = {
    flex: 2,
    width: '100%',
    gap: small ? '$sm' : '$md',
    alignItems: 'flex-start',
    p: small ? '$md $sm $md' : '0',
  };

  return (
    <Panel as={AppLink} to={coLinksPaths.explore} css={{ ...panelStyles }}>
      <Flex
        className="art"
        css={{
          ...artStyles,
          backgroundImage: "url('/imgs/background/colink-other.jpg')",
          backgroundPosition: 'bottom',
        }}
      />
      <Flex column css={{ ...copyContainerStyles, color: '$text' }}>
        <Text size={small ? 'medium' : 'large'} semibold>
          {title}
        </Text>
        <Text size={small ? 'small' : 'medium'}>{message}</Text>
        <Button as="span" color="secondary" size={small ? 'xs' : 'small'}>
          {buttonTitle}
        </Button>
      </Flex>
    </Panel>
  );
};
