import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { coLinksPaths } from 'routes/paths';
import { AppLink, Button, Flex, Panel, Text } from 'ui';

export const CoLinksTaskCards = ({
  currentUserAddress,
  small,
}: {
  currentUserAddress: string;
  small?: boolean;
}) => {
  const { data: myProfile } = useQuery(
    [QUERY_KEY_COLINKS, currentUserAddress, 'taskRep'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: currentUserAddress,
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
    [QUERY_KEY_COLINKS, currentUserAddress, 'taskKeys'],
    async () => {
      const { hasOtherKey } = await client.query(
        {
          __alias: {
            hasOtherKey: {
              link_holders: [
                {
                  where: {
                    holder: {
                      _eq: currentUserAddress,
                    },
                    target: {
                      _neq: currentUserAddress,
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
    minHeight: '200px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };
  const copyContainerStyles = {
    flex: 2,
    gap: small ? '$sm' : '$md',
    alignItems: 'flex-start',
    p: small ? '$sm $sm $md' : '0',
  };

  return (
    <Flex column css={{ gap: '$md' }}>
      {myProfile?.reputation_score &&
        myProfile?.reputation_score?.total_score < 51 && (
          <Panel
            as={AppLink}
            to={coLinksPaths.account}
            css={{ ...panelStyles }}
          >
            <Flex
              className="art"
              css={{
                ...artStyles,
                backgroundImage: "url('/imgs/background/colink-rep.jpg')",
              }}
            />
            <Flex column css={{ ...copyContainerStyles, color: '$text' }}>
              <Text size={small ? 'medium' : 'large'} semibold>
                Boost Your Rep
              </Text>
              <Text size={small ? 'small' : 'medium'}>
                Establish your repulation by linking other channels like
                LinkedIn, Twitter, or your email address.
              </Text>
              <Button as="span" color="secondary" size={small ? 'xs' : 'small'}>
                Connect Channels
              </Button>
            </Flex>
          </Panel>
        )}
      {!keyData?.hasOtherKey && (
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
              Purchase a Link
            </Text>
            <Text size={small ? 'small' : 'medium'}>
              Purchase your first link to someone, make professional
              connections, make friends, have fun!
            </Text>
            <Button as="span" color="secondary" size={small ? 'xs' : 'small'}>
              Explore Links
            </Button>
          </Flex>
        </Panel>
      )}
    </Flex>
  );
};
