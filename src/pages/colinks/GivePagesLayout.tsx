import { Helmet } from 'react-helmet';

import { PointsBar } from '../../features/points/PointsBar';
import { PartySearchBox } from '../../features/SearchBox/PartySearchBox';
import { coLinksPaths } from '../../routes/paths';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const GivePagesLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
              <PartySearchBox
                size={'large'}
                registerKeyDown={false}
                skillFunc={coLinksPaths.giveSkill}
                profileFunc={coLinksPaths.profile}
              />
              <Text>TODO: breadcrumbs or other give navigation</Text>
            </Flex>
          </Flex>
          <PointsBar />
        </ContentHeader>
      </SingleColumnLayout>
      {children}
    </Flex>
  );
};
