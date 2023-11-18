import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { BuyOrSellCoLinks } from '../BuyOrSellCoLinks';
import { CoLinksProvider } from '../CoLinksContext';
import { Avatar, Flex, Text } from 'ui';

import { QUERY_KEY_COLINKS } from './CoLinksWizard';
import { SkipButton } from './SkipButton';
import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

const LIMIT = 3;

export const WizardBuyOtherLinks = ({
  address,
  hasOtherKey,
  skipStep,
}: {
  address: string;
  hasOtherKey: boolean;
  skipStep: () => void;
}) => {
  const { data } = useQuery([QUERY_KEY_COLINKS, 'leaderboard'], async () => {
    const { most_holders } = await client.query(
      {
        __alias: {
          most_holders: {
            cosouls: [
              {
                where: {
                  address: {
                    _neq: address,
                  },
                },
                limit: LIMIT,
                order_by: [
                  {
                    link_holders_aggregate: {
                      sum: {
                        amount: order_by.desc_nulls_last,
                      },
                    },
                  },
                ],
              },
              {
                profile_public: {
                  name: true,
                  avatar: true,
                  address: true,
                },
                link_holders_aggregate: [
                  {},
                  {
                    aggregate: {
                      sum: { amount: true },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      {
        operationName: 'coLinks_leaderboard',
      }
    );
    return {
      targets: most_holders.map(h => ({
        count: h.link_holders_aggregate?.aggregate?.sum?.amount ?? 0,
        ...h.profile_public,
      })),
    };
  });

  return (
    <>
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-other.jpg')",
        }}
      />
      <WizardInstructions>
        <Flex column>
          <Text h2>Buy Some Links</Text>
          <Text inline size={'xs'}>
            Linked members <strong>both</strong> see each other&apos;s posts
          </Text>
        </Flex>

        {!data ? (
          <Text>Loading</Text>
        ) : (
          data.targets.map(leader =>
            !leader.address ? null : (
              <Flex
                column
                key={leader.address}
                css={{
                  gap: '$sm',
                  width: '100%',
                  pb: '$md',
                  borderBottom: '1px solid $borderDim',
                }}
              >
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    gap: '$md',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Flex css={{ alignItems: 'center', gap: '$md' }}>
                    <Avatar
                      path={leader.avatar}
                      name={leader.name}
                      size="small"
                    />
                    <Text inline semibold size="small">
                      {leader.name}
                    </Text>
                  </Flex>
                  <Text tag color={'secondary'} inline size="small">
                    {leader.count} links
                  </Text>
                </Flex>
                <CoLinksProvider>
                  <BuyOrSellCoLinks
                    hideTitle={true}
                    subject={leader.address}
                    address={address}
                    buyOneOnly={true}
                  />
                </CoLinksProvider>
              </Flex>
            )
          )
        )}
        <SkipButton onClick={skipStep}>
          {hasOtherKey ? 'Continue' : 'Skip for now'}
        </SkipButton>
      </WizardInstructions>
    </>
  );
};
