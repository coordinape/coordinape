import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm } from 'react-hook-form';
import * as z from 'zod';

import { ApeInfoTooltip, LoadingModal, makeTable } from 'components';
import { DISTRIBUTION_TYPE } from 'config/constants';
import {
  Avatar,
  Box,
  Panel,
  Flex,
  Text,
  Button,
  Link,
  Form,
  CheckBox,
  Modal,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { smartRounding } from 'utils';
import { makeExplorerUrl } from 'utils/provider';

import { useClaimsTableData, ClaimsRowData } from './hooks';
import { QueryClaim } from './queries';
import {
  formatDistributionDates,
  formatDeletedDistributionDates,
  formatClaimAmount,
} from './utils';

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
      {claim.distribution.epoch
        ? `Epoch ${claim.distribution.epoch.number} - `
        : ''}
      {displayDistributionType(claim.distribution.distribution_type)}:{' '}
      {smartRounding(claim.new_amount)}
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

const DeletedUserClaimsRow: React.FC<ClaimsRowData> = ({ group, children }) => {
  return (
    <tr>
      <td>
        <Flex>
          <Text size="small">Unknown</Text>
        </Flex>
      </td>
      <td>
        <Flex>
          <Text size="small">Unknown</Text>
        </Flex>
      </td>
      <td>
        <Text size="small" css={{ lineHeight: 0 }}>
          <ApeInfoTooltip>{groupTooltipInfo(group)}</ApeInfoTooltip>
          <Text size="small" css={{ ml: '$xs' }}>
            {formatDeletedDistributionDates(group)}
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

const ClaimsRowOuter: React.FC<ClaimsRowData> = ({ claim, group, children }) =>
  claim.distribution.epoch ? (
    <ClaimsRow claim={claim} key={claim.id} group={group}>
      {children}
    </ClaimsRow>
  ) : (
    <DeletedUserClaimsRow claim={claim} key={claim.id} group={group}>
      {children}
    </DeletedUserClaimsRow>
  );

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
  const [groupArr, setGroupArr] = useState<QueryClaim[]>([]);
  const [unwrapModalVisible, setUnwrapModalVisible] = useState(false);

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
              <ClaimsRowOuter key={claim.id} claim={claim} group={group}>
                <Flex css={{ justifyContent: 'end' }}>
                  <Button
                    color="primary"
                    outlined
                    css={buttonStyles}
                    onClick={() => {
                      if (
                        claim.distribution.vault.symbol.toUpperCase() === 'WETH'
                      ) {
                        setGroupArr(group);
                        setUnwrapModalVisible(true);
                      } else return processClaim(group.map(c => c.id));
                    }}
                    disabled={isClaiming || isClaimed}
                  >
                    {isClaiming
                      ? 'Claiming...'
                      : isClaimed
                      ? 'Claimed'
                      : `Claim ${claim.distribution.vault.symbol}`}
                  </Button>
                </Flex>
              </ClaimsRowOuter>
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
            <ClaimsRowOuter key={claim.id} claim={claim} group={group}>
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
            </ClaimsRowOuter>
          )}
        </ClaimsTable>
        <UnwrapETHmodal
          processClaim={processClaim}
          group={groupArr}
          open={unwrapModalVisible}
          onClose={() => {
            setUnwrapModalVisible(false);
          }}
        />
      </Panel>
    </SingleColumnLayout>
  );
}

export function UnwrapETHmodal({
  group,
  onClose,
  open,
  processClaim,
}: {
  group: QueryClaim[];
  onClose: () => void;
  open: boolean;
  processClaim: (claimIds: number[], unwrapEth: boolean) => void;
}) {
  const schema = z
    .object({
      unwrap_weth: z.boolean(),
    })
    .strict();
  type UnwrapFormSchema = z.infer<typeof schema>;
  const { handleSubmit, control } = useForm<UnwrapFormSchema>({
    resolver: zodResolver(schema),
  });

  const { field: unwrapWeth } = useController({
    name: 'unwrap_weth',
    control,
    defaultValue: true,
  });

  const onSubmit = () => {
    processClaim(
      group.map(c => c.id),
      unwrapWeth.value
    );
    onClose();
  };

  return (
    <Modal title="Unwrap ETH" open={open} onClose={onClose}>
      <Form
        css={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '$sm 0 $lg',
          overflowY: 'auto',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <CheckBox {...unwrapWeth} label="Unwrap WETH to ETH" />
        <Button
          css={{ mt: '$lg', gap: '$xs' }}
          color="primary"
          outlined
          size="large"
          type="submit"
          fullWidth
        >
          Claim
        </Button>
        <Text
          size="small"
          css={{ color: '$secondaryText', alignSelf: 'center', mt: '$sm' }}
        >
          When this is checked, you will sign two transactions: one to claim,
          and one to unwrap WETH to ETH.
        </Text>
      </Form>
    </Modal>
  );
}
