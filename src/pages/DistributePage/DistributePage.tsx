import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { FormControl, MenuItem, Select } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Link, Box, Panel, Button } from '../../ui';
import { ApeTextField } from 'components';
import { useEpochIdForCircle, useCurrentOrg } from 'hooks/gql';
import { useVaults } from 'recoilState/vaults';
import * as paths from 'routes/paths';

import AllocationTable from './AllocationsTable';
import ShowMessage from './ShowMessage';

import { IUser } from 'types';

/**
 * Displays a list of allocations and allows generation of Merkle Root for a given circle and epoch.
 * @param epochId string
 * @returns JSX.Element
 */
function DistributePage() {
  // Route Parameters
  const { epochId } = useParams();
  const [amount, setAmount] = useState(0);
  const [updateAmount, setUpdateAmount] = useState(0);
  const [selectedVault, setSelectedVault] = useState('');
  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg?.id);
  let vaultOptions: Array<{ value: number; label: string; id: string }> = [];

  const { isLoading, isError, data } = useEpochIdForCircle(Number(epochId));
  if (!data?.epochs_by_pk) {
    return <ShowMessage message={`Sorry, Epoch ${epochId} was not found.`} />;
  }

  const circle = data?.epochs_by_pk?.circle;
  const epoch = data?.epochs_by_pk;

  const users: IUser[] | undefined = Array.isArray(circle?.users)
    ? circle?.users?.map(u => {
        const user: IUser = {
          isCircleAdmin: false,
          isCoordinapeUser: false,
          teammates: [],
          id: u.id,
          circle_id: u.circle_id,
          address: u.address,
          name: u.name,
          non_giver: u.non_giver,
          fixed_non_receiver: u.fixed_non_receiver,
          starting_tokens: u.starting_tokens,
          non_receiver: u.non_receiver,
          give_token_received: u.give_token_received,
          give_token_remaining: u.give_token_remaining,
          epoch_first_visit: u.epoch_first_visit,
          created_at: u.created_at,
          updated_at: u.updated_at,
          role: u.role,
        };
        return user;
      })
    : [];

  const totalGive = users?.reduce((s, a) => s + a.starting_tokens, 0);

  //TODO: Add a check to see if the user is a circle admin
  if (!epochId) {
    return (
      <ShowMessage message="Sorry, you are not a circle admin so you can't access this feature." />
    );
  }

  if (isLoading) {
    return <ShowMessage message="Loading..." />;
  }

  if (isError) {
    return (
      <ShowMessage message="Sorry, there was an error retreiving your epoch information." />
    );
  }

  if (!epoch) {
    return <ShowMessage message={`Sorry, epoch ${epochId} was not found.`} />;
  }

  if (!epoch?.ended) {
    return (
      <ShowMessage
        message={`Sorry, ${circle?.name}: Epoch ${epoch?.number} is still active. You can only distribute epochs that have ended.`}
      />
    );
  }

  if (vaults?.length > 0) {
    vaultOptions = vaults.map((vault, index) => ({
      value: index,
      label: vault.type,
      id: vault.id,
    }));
  } else {
    return (
      <ShowMessage message="No vaults have been associated with your address. Please create a vault." />
    );
  }

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        m: '$lg',
        margin: 'auto',
        maxWidth: '90%',
      }}
    >
      <Panel>
        <Box
          css={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            mt: '$lg',
          }}
        >
          <Box css={{ minWidth: '15%' }}>
            <Link
              href={paths.getVaultsPath()}
              css={{
                fontSize: '$4',
                lineHeight: '$shorter',
                alignSelf: 'center',
                color: '$text',
                display: 'flex',
                alignItems: 'center',
                ml: '$lg',
              }}
            >
              <ArrowBackIcon />
              Back to Vaults
            </Link>
          </Box>
          <Box
            css={{
              textTransform: 'capitalize',
              fontSize: '$9',
              lineHeight: '$shorter',
              fontWeight: '$bold',
              color: '$text',
            }}
          >
            {`${circle?.name}: Epoch ${epoch?.number} has completed`}
          </Box>
          <Box css={{ minWidth: '15%' }}></Box>
        </Box>

        <Box css={{ display: 'flex', justifyContent: 'center', pt: '$lg' }}>
          <Box
            css={{ mb: '$lg', mt: '$xs', mr: '$md', minWidth: '$selectWidth' }}
          >
            <FormControl fullWidth>
              <Box
                css={{
                  color: '$text',
                  fontSize: '$4',
                  fontWeight: '$bold',
                  lineHeight: '$shorter',
                  marginBottom: '$md',
                }}
              >
                Select Vault
              </Box>
              <Select
                value={selectedVault}
                label="Vault"
                onChange={({ target: { value } }) => {
                  setSelectedVault(value as unknown as string);
                }}
              >
                {vaultOptions.map(vault => (
                  <MenuItem key={vault.id} value={vault.label}>
                    {vault.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <ApeTextField
              value={amount}
              onBlur={({ target: { value } }) =>
                setUpdateAmount(value as unknown as number)
              }
              onChange={({ target: { value } }) =>
                setAmount(value as unknown as number)
              }
              label="Total Distribution Amount"
            />
          </Box>
        </Box>
        <Box css={{ display: 'flex', justifyContent: 'center' }}>
          <Button color="red" size="medium">
            Submit Distribution to Vault
          </Button>
        </Box>
        <Box
          css={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Box css={{ pt: '$md', color: '$text' }}>
            Please review the distribution details below and if all looks good,
            approve the Merkle root so that contributoros can claim their funds.
          </Box>
        </Box>
        <Box css={{ m: '$lg' }}>
          <AllocationTable
            users={users as IUser[]}
            totalAmountInVault={updateAmount}
            tokenName={selectedVault}
            totalGive={totalGive as number}
          />
        </Box>
      </Panel>
    </Box>
  );
}

export default DistributePage;
