import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { NewApeAvatar } from 'components';
import { Box, Link, Panel, Table, TableBorder, Flex, Text } from 'ui';
import { getCircleAvatar } from 'utils/domain';

import { makeTable } from './Table';

type OrgClaims = {
  org_name: string;
  org_id: number;
  claim: {
    id: number;
    circle_name: string;
    epoch: number;
    rewards: {
      value: number;
      symbol?: string;
      claim_id: number;
    }[];
    logo?: string;
  };
};

const ClaimsTable = makeTable<OrgClaims>('ClaimsTable');

export default function ClaimsPage() {
  const claims: OrgClaims[] = [
    {
      org_name: 'Yearn',
      org_id: 1,
      claim: {
        id: 2,
        circle_name: 'Circle 1',
        epoch: 2,
        rewards: [
          {
            value: 1200,
            symbol: 'USDC',
            claim_id: 110,
          },
          {
            value: 1290,
            symbol: 'YToken',
            claim_id: 100,
          },
        ],
      },
    },
    {
      org_name: 'Gitcoin',
      org_id: 1,
      claim: {
        id: 2,
        circle_name: 'Grants Team',
        epoch: 2,
        rewards: [
          {
            value: 200,
            symbol: 'USDC',
            claim_id: 1,
          },
          {
            value: 750,
            symbol: 'GTC',
            claim_id: 2,
          },
        ],
      },
    },
  ];

  return (
    <Box
      css={{
        margin: '$lg auto',
        maxWidth: '$mediumScreen',
      }}
    >
      <Panel css={{ minHeight: '60vh' }}>
        <Box
          css={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href={'/'}
            css={{
              fontSize: '$4',
              lineHeight: '$shorter',
              alignSelf: 'center',
              color: '$text',
              display: 'flex',
              alignItems: 'center',
              ml: '$lg',
              cursor: 'pointer',
            }}
          >
            <ArrowBackIcon />
            Back
          </Link>
        </Box>
        <Box
          css={{
            fontSize: '$6',
            color: '$text',
            display: 'flex',
            alignItems: 'left',
            ml: '$lg',
            mt: '$lg',
          }}
        >
          Claim Your Funds
        </Box>
        <Box
          css={{
            fontSize: '$4',
            color: '$text',
            display: 'flex',
            alignItems: 'left',
            ml: '$lg',
            mt: '$lg',
          }}
        >
          <Box>
            You can claim all your rewards from this page. Note that you can
            claim them for all your epochs in one circle but each token requires
            its own claim transaction.
          </Box>
          <Box css={{ minWidth: '40%' }}></Box>
        </Box>
        <Box
          css={{
            ml: '$lg',
          }}
        >
          {claims.map(claim => (
            <>
              <Text css={{ my: '$lg', fontSize: '$6' }}>{claim.org_name}</Text>
              <ClaimsTable
                key={claim.org_id}
                Table={Table}
                TableBorder={TableBorder}
                headers={['Circle', 'Epochs', `Rewards`, ``, ``]}
                data={claims}
                startingSortIndex={2}
                startingSortDesc
                sortByIndex={(index: number) => {
                  if (index === 0) return (c: OrgClaims) => c.claim.circle_name;
                  if (index === 1) return (c: OrgClaims) => c.claim.epoch;
                  return (c: OrgClaims) => c.claim.rewards.length;
                }}
              >
                {claim => (
                  <tr key={claim.claim.id}>
                    <td>
                      <Flex row css={{ alignItems: 'left', gap: '$sm' }}>
                        <NewApeAvatar
                          path={getCircleAvatar({
                            avatar: claim.claim.logo,
                            circleName: claim.claim.circle_name,
                          })}
                          style={{ height: '32px', width: '32px' }}
                        />
                        <Text semibold>{claim.claim.circle_name}</Text>
                      </Flex>
                    </td>
                    <td>{claim.claim.epoch}</td>
                    {claim.claim.rewards.map(reward => (
                      <td key={reward.claim_id}>
                        {reward.value} {reward.symbol}
                      </td>
                    ))}
                    <td>
                      <Flex
                        row
                        css={{
                          alignItems: 'right',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {claim.claim.rewards.map((reward, index) => (
                          <Link
                            key={index}
                            href={'/'}
                            css={{
                              fontSize: '$4',
                              lineHeight: '$shorter',
                              color: '$red',
                              display: 'flex',
                              alignItems: 'center',
                              ml: '$md',
                              mr: '$md',
                              cursor: 'pointer',
                              minWidth: '8vw',
                            }}
                          >
                            Claim {reward.symbol}
                          </Link>
                        ))}
                      </Flex>
                    </td>
                  </tr>
                )}
              </ClaimsTable>
            </>
          ))}
        </Box>
      </Panel>
    </Box>
  );
}
