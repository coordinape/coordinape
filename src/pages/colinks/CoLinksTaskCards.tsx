import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Panel, Text } from 'ui';

export const CoLinksTaskCards = ({ holder }: { holder: string }) => {
  const { data: myProfile } = useQuery(
    [QUERY_KEY_COLINKS, holder, 'taskRep'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: holder,
                },
              },
              limit: 1,
            },
            {
              reputation_score: {
                total_score: true,
              },
            },
          ],
        },
        {
          operationName: 'coLinks_tasks_checkRep',
        }
      );
      return profiles_public.pop();
    }
  );

  const { data: keyData } = useQuery(
    [QUERY_KEY_COLINKS, holder, 'taskKeys'],
    async () => {
      const { hasOtherKey } = await client.query(
        {
          __alias: {
            hasOtherKey: {
              link_holders: [
                {
                  where: {
                    holder: {
                      _eq: holder,
                    },
                    target: {
                      _neq: holder,
                    },
                  },
                  limit: 1,
                },
                {
                  amount: true,
                  target: true,
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_tasks_hasOtherKeys',
        }
      );
      return {
        hasOtherKey: hasOtherKey[0]?.amount > 0,
      };
    }
  );

  const panelStyles = {
    border: 'none',
    flexDirection: 'row',
    p: '0 $md 0 0',
    overflow: 'clip',
    alignItems: 'center',
    gap: '$lg',
  };
  const artStyles = {
    flexGrow: 1,
    height: '100%',
    minHeight: '200px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };
  const copyContainerStyles = {
    flex: 2,
    gap: '$md',
    alignItems: 'flex-start',
  };

  return (
    <Flex column css={{ gap: '$md' }}>
      {myProfile?.reputation_score &&
        myProfile?.reputation_score?.total_score <= 31 && (
          <Panel css={{ ...panelStyles }}>
            <Flex
              className="art"
              css={{
                ...artStyles,
                backgroundImage: "url('/imgs/background/colink-rep.jpg')",
              }}
            />
            <Flex column css={{ ...copyContainerStyles }}>
              <Text size="large" semibold>
                Boost Your Rep
              </Text>
              <Text p as="p">
                Establish your repulation by linking other channels like
                LinkedIn, Twitter, or your email address.
              </Text>
              <Button
                as={NavLink}
                to={coLinksPaths.account}
                color="neutral"
                size="small"
              >
                Connect Channels
              </Button>
            </Flex>
          </Panel>
        )}
      {!keyData?.hasOtherKey && (
        <Panel css={{ ...panelStyles }}>
          <Flex
            className="art"
            css={{
              ...artStyles,
              backgroundImage: "url('/imgs/background/colink-other.jpg')",
            }}
          />
          <Flex column css={{ ...copyContainerStyles }}>
            <Text size="large" semibold>
              Purchase a Link
            </Text>
            <Text p as="p">
              Purchase your first link to someone, make professional
              connections, make friends, have fun!
            </Text>
            <Button
              as={NavLink}
              to={coLinksPaths.explore}
              color="neutral"
              size="small"
            >
              Explore Links
            </Button>
          </Flex>
        </Panel>
      )}
    </Flex>
  );
};
