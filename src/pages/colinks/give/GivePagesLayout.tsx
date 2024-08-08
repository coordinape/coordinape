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
        <ContentHeader>
          <Flex
            css={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Flex column css={{ gap: '$md' }}>
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
                  Give is a bla bla thing and its really great you should do it
                </Text>
              )}
              <PartySearchBox
                size={'large'}
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
