import { useState, ChangeEvent } from 'react';

import { useParams } from 'react-router-dom';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Link, Box, Panel, Button } from '../../ui';
import { FormTextField } from 'components';
import { useCircleIdForEpoch, useCurrentOrg } from 'hooks/gql';
import { useSelectedCircle } from 'recoilState';
import { useVaults } from 'recoilState/vaults';
import * as paths from 'routes/paths';

import AllocationTable from './AllocationsTable';

/**
 * Displays a list of allocations and allows generation of Merkle Root for a given circle and epoch.
 * @param epochId string
 * @returns JSX.Element
 */
const DistributePage = () => {
  // Route Parameters
  const { epochId } = useParams();
  const [amount, setAmount] = useState('');
  const [selectedVault, setSelectedVault] = useState<string>('');
  const [amountError] = useState<boolean>(false);
  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg?.id);
  let vaultOptions: Array<{ value: string; label: string; id: string }> = [];

  const actualCircleId = useCircleIdForEpoch(Number(epochId));

  const handleVaultChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSelectedVault(event.target.value as string);
  };
  const handleAmountChange = (event: ChangeEvent<{ value: unknown }>) => {
    setAmount(event.target.value as string);
  };

  const { users } = useSelectedCircle();

  /**
   * Shows a custom error message when unauthorized access is detected.
   * @param message string
   * @returns JSX.Element
   */
  const NotAuthorized = ({ message }: { message: string }) => (
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
            alignItems: 'center',
            fontSize: 30,
            mt: '$md',
            justifyContent: 'center',
            color: '$text',
          }}
        >
          {message}
        </Box>
      </Panel>
    </Box>
  );

  // TODO: Add specific checks for Circle or Vault Admin
  if (!epochId) {
    return (
      <NotAuthorized message="Sorry, you are not a circle admin so you can't access this feature." />
    );
  }

  //Check if address is associated to any vaults
  if (!vaults) {
    return (
      <NotAuthorized message="No vaults have been associated with your address. Please create a vault." />
    );
  } else {
    vaultOptions = vaults.map(vault => ({
      value: vault.id,
      label: vault.type,
      id: vault.id,
    }));
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
              fontWeight: 700,
              color: '$text',
            }}
          >
            Strategists: Epoch 22 for circle {actualCircleId} has ended
          </Box>
          <Box css={{ minWidth: '15%' }}></Box>
        </Box>

        <Box css={{ display: 'flex', justifyContent: 'center', pt: '$lg' }}>
          <Box css={{ m: '$lg', minWidth: '$selectWidth' }}>
            <FormControl fullWidth>
              <InputLabel>Select Vault</InputLabel>
              <Select
                labelId="Select Vault 1"
                label="Select Vault"
                value={selectedVault}
                onChange={handleVaultChange}
              >
                {vaultOptions.map(vault => (
                  <MenuItem key={vault.id} value={vault.value}>
                    {vault.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormTextField
              value={amount}
              onChange={handleAmountChange}
              label="Total Distribution Amount"
              error={amountError}
              errorText=""
            />
          </Box>
        </Box>
        <Box css={{ display: 'flex', justifyContent: 'center' }}>
          <Button color={'red'} size={'medium'}>
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
          <AllocationTable users={users} />
        </Box>
      </Panel>
    </Box>
  );
};

export default DistributePage;
