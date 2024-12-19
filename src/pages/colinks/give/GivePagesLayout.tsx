import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { GiveBreadCrumbs } from './GiveBreadCrumbs';
import { LearnAboutGiveCard } from './LearnAboutGiveCard';

export const GivePagesLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { skill } = useParams();
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
        <ContentHeader css={{ mb: 0, minHeight: 117 }}>
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
          </Flex>
        </ContentHeader>
      </SingleColumnLayout>
      {children}
    </Flex>
  );
};
