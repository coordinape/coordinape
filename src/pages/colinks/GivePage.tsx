import { Helmet } from 'react-helmet';

import { coLinksPaths } from '../../routes/paths';
import { AppLink, Button, Flex, Panel, Text } from '../../ui';
import { TwoColumnSmallRightLayout } from '../../ui/layouts';
import { GiveLeaderboard } from '../GiveLeaderboard';

export const GivePage = () => {
  return (
    <Flex column>
      <Helmet>
        <title>GIVE / CoLinks</title>
      </Helmet>
      <TwoColumnSmallRightLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <GiveLeaderboard linkFunc={coLinksPaths.giveSkill} />
        <Flex column css={{ gap: '$xl' }}>
          <LearnCard
            title="Give bot is a thing"
            message="show how to use it"
            buttonTitle={'learn how to use Give Bot'}
            image="/imgs/background/colink-own.jpg"
          />
          <LearnCard
            title="Give Party!!!"
            message="you can do a give party"
            buttonTitle={'Start a GIVE Party'}
            image="/imgs/background/colink-rep.jpg"
          />
          <LearnCard
            title="How Else Can you GIVE?"
            message="you can do stuff"
            buttonTitle={'Learm More'}
            image="/imgs/background/colink-sniped.jpg"
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
  image,
}: {
  small?: boolean;
  title: string;
  message: string;
  buttonTitle: string;
  image: string;
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
          backgroundImage: `url('${image}')`,
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
