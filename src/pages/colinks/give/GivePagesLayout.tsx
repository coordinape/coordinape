import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { PartySearchBox } from '../../../features/SearchBox/PartySearchBox';
import { coLinksPaths } from '../../../routes/paths';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { GiveBreadCrumbs } from './GiveBreadCrumbs';

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
          <title>GIVE / CoLinks</title>
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
                <Text inline>
                  All the people who have received GIVE for{' '}
                  <Text inline semibold>
                    {skill}
                  </Text>
                </Text>
              ) : (
                <Text>
                  GIVE is the onchain Social Oracle that empowers recognition
                  and connections in web3.
                </Text>
              )}
            </Flex>
            <Flex css={{ width: '100%', maxWidth: 300 }}>
              <PartySearchBox
                size={'medium'}
                registerKeyDown={false}
                skillFunc={coLinksPaths.giveSkill}
                profileFunc={coLinksPaths.profileGive}
              />
            </Flex>
          </Flex>
        </ContentHeader>
      </SingleColumnLayout>
      {children}
    </Flex>
  );
};
