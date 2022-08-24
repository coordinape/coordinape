import { ApeInfoTooltip, LoadingModal, makeTable } from 'components';
import { DISTRIBUTION_TYPE } from 'config/constants';
import { Avatar, Box, Panel, Flex, Text, Button, Link } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { numberWithCommas } from 'utils';
import { makeExplorerUrl } from 'utils/provider';

import { useClaimsTableData, ClaimsRowData } from './hooks';
import { QueryClaim } from './queries';
import { formatDistributionDates, formatClaimAmount } from './utils';

const styles = {
  alignRight: { textAlign: 'right' },
};

const buttonStyles = {
  fontWeight: '$medium',
  minHeight: '$xs',
  px: '$sm',
  minWidth: '11vw',
  borderRadius: '$2',
};

const displayDistributionType = (
  type: QueryClaim['distribution']['distribution_type']
): string => {
  if (type == DISTRIBUTION_TYPE['GIFT']) {
    return 'Gift Circle';
  } else if (type == DISTRIBUTION_TYPE['FIXED']) {
    return 'Fixed Payment';
  } else if (type == DISTRIBUTION_TYPE['COMBINED']) {
    return 'Gift + Fixed';
  } else {
    return 'Unknown';
  }
};
const groupTooltipInfo = (group: QueryClaim[]) => {
  const detailsList = group.map(claim => (
    <Flex key={claim.id}>
      Epoch {claim.distribution.epoch.number} -{' '}
      {displayDistributionType(claim.distribution.distribution_type)}:{' '}
      {numberWithCommas(claim.new_amount, 2)}
    </Flex>
  ));
  return <Box>{detailsList}</Box>;
};

const ClaimsRow: React.FC<ClaimsRowData> = ({ claim, group, children }) => {
  return (
    <tr>
      <td>
        <Flex>
          {claim.distribution.epoch.circle?.logo ? (
            <Avatar
              size="small"
              path={claim.distribution.epoch.circle?.logo}
              css={{ my: 0, ml: 0 }}
            />
          ) : (
            ''
          )}
          <Text size="small">
            {claim.distribution.epoch.circle?.organization?.name}
          </Text>
        </Flex>
      </td>
      <td>
        <Text size="small">{claim.distribution.epoch.circle?.name}</Text>
      </td>
      <td>
        <Text size="small" css={{ lineHeight: 0 }}>
          <ApeInfoTooltip>{groupTooltipInfo(group)}</ApeInfoTooltip>
          <Text size="small" css={{ ml: '$xs' }}>
            {formatDistributionDates(group)}
          </Text>
        </Text>
      </td>
      <td>
        <Text size="small">{formatClaimAmount(group)}</Text>
      </td>
      <td className="alignRight">{children}</td>
    </tr>
  );
};

export default function ClaimsPage() {
  // this causes errors if it's run at the top-level
  const ClaimsTable = makeTable<ClaimsRowData>('ClaimsTable');

  const {
    isIdle,
    isLoading,
    isError,
    error,
    claims,
    claimedClaimsRows,
    unclaimedClaimsRows,
    claiming,
    processClaim,
  } = useClaimsTableData();

  if (isIdle || isLoading) return <LoadingModal visible />;
  if (isError || !claims)
    return (
      <SingleColumnLayout>
        {!claims ? (
          <>No claims found.</>
        ) : (
          <>Error retrieving your claims. {error}</>
        )}
      </SingleColumnLayout>
    );

  return (
    <SingleColumnLayout>
      <Text h1>Claim Tokens</Text>
      <Box css={{ color: '$neutral', maxWidth: '60%' }}>
        You can claim all your tokens from this page. Note that you can claim
        them for all your epochs in one circle but each token requires its own
        claim transaction.
      </Box>

      <Panel css={{ mb: '$lg' }}>
        <ClaimsTable
          headers={[
            { title: 'Organization' },
            { title: 'Circle' },
            { title: 'Distributions' },
            { title: 'Rewards' },
            { title: 'Claims', css: styles.alignRight },
          ]}
          data={unclaimedClaimsRows}
          startingSortIndex={2}
          startingSortDesc={false}
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ claim, group }) => {
            const isClaiming = claiming[claim.id] === 'pending';
            const isClaimed = claiming[claim.id] === 'claimed';
            return (
              <ClaimsRow claim={claim} key={claim.id} group={group}>
                <Flex css={{ justifyContent: 'end' }}>
                  <Button
                    color="primary"
                    outlined
                    css={buttonStyles}
                    onClick={() => processClaim(claim.id)}
                    disabled={isClaiming || isClaimed}
                  >
                    {isClaiming
                      ? 'Claiming...'
                      : isClaimed
                      ? 'Claimed'
                      : `Claim ${claim.distribution.vault.symbol}`}
                  </Button>
                </Flex>
              </ClaimsRow>
            );
          }}
        </ClaimsTable>
      </Panel>

      <Text h2 css={{ mb: '$sm' }}>
        Claims History
      </Text>
      <Panel>
        <ClaimsTable
          headers={[
            { title: 'Organization' },
            { title: 'Circle' },
            { title: 'Epochs' },
            { title: 'Rewards' },
            { title: 'Transactions', css: styles.alignRight },
          ]}
          data={claimedClaimsRows}
          startingSortIndex={2}
          startingSortDesc={false}
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ claim, group }) => (
            <ClaimsRow claim={claim} key={claim.id} group={group}>
              <Link
                css={{ mr: '$md' }}
                target="_blank"
                href={makeExplorerUrl(
                  claim.distribution.vault.chain_id,
                  claim.txHash
                )}
              >
                View on Etherscan
              </Link>
            </ClaimsRow>
          )}
        </ClaimsTable>
      </Panel>
    </SingleColumnLayout>
  );
}
