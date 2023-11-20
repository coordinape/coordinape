import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { FeaturedLink } from '../FeaturedLink';
import { Flex, Text } from 'ui';

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
              <FeaturedLink
                key={leader.address}
                target={{
                  name: leader.name,
                  address: leader.address,
                  count: leader.count,
                  countName: 'links',
                }}
              />
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
