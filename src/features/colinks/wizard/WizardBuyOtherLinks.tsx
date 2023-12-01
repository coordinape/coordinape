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
  skipStep,
}: {
  address: string;
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
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, #1F1518 10%, #73CFCE 38%, #DCE6CA 72%, #B56C6A 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-other.jpg')",
          backgroundPosition: 'bottom',
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$sm' }}>
          <Text h2>Buy Some Links</Text>
          <Text inline size={'small'}>
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
        <SkipButton onClick={skipStep} />
      </WizardInstructions>
    </>
  );
};
