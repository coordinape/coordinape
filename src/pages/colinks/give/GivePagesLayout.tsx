import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { CoLinksSearchBox } from '../../../features/SearchBox/CoLinksSearchBox';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import useMobileDetect from 'hooks/useMobileDetect';

import { GiveBreadCrumbs } from './GiveBreadCrumbs';
import { LearnAboutGiveCard } from './LearnAboutGiveCard';

export const GivePagesLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { skill } = useParams();
  const { isMobile } = useMobileDetect();
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
          <title>GIVE / Coordinape</title>
        </Helmet>
        <ContentHeader css={{ mb: 0 }}>
          <Flex
            column
            css={{
              width: '100%',
              gap: '$md',
              alignItems: 'flex-start',
            }}
          >
            <Flex column css={{ gap: '$sm' }}>
              {/*<Text h2 display>*/}
              {/*  GIVE*/}
              {/*</Text>*/}
              <GiveBreadCrumbs
                skill={skill}
                subsection={skill ? undefined : 'Skills'}
              />
              {skill ? (
                <Flex column css={{ gap: '$xs' }}>
                  <Text inline>
                    All the people who have received GIVE for{' '}
                    <Text inline semibold>
                      {skill}
                    </Text>
                  </Text>
                  <LearnAboutGiveCard linkText="What is GIVE?" />
                </Flex>
              ) : (
                <Text>
                  GIVE is the onchain Social Oracle that empowers recognition
                  and connections in web3.
                </Text>
              )}
            </Flex>
            <Flex css={{ width: '100%', maxWidth: 300 }}>
              <CoLinksSearchBox
                size={isMobile ? 'medium' : 'large'}
                registerKeyDown={false}
              />
            </Flex>
          </Flex>
        </ContentHeader>
      </SingleColumnLayout>
      {children}
    </Flex>
  );
};
