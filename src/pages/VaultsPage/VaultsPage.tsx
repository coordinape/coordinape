import { useState } from 'react';

import { OrganizationHeader } from 'components';
import { useCurrentOrg } from 'hooks/gql';
import { useVaults } from 'recoilState/vaults';
import { Box, Button, Text } from 'ui';

// eslint-disable-next-line import/no-named-as-default
import CreateVaultModal from './CreateVaultModal';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState<'' | 'create'>('');
  const closeModal = () => setModal('');

  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg?.id);

  return (
    <Box
      css={{
        maxWidth: '$mediumScreen',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '$md',
      }}
    >
      <OrganizationHeader />
      <Box css={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text css={{ fontSize: '$8', fontWeight: '$bold' }}>Vaults</Text>
        <Button color="red" size="small" onClick={() => setModal('create')}>
          Add Vault
        </Button>
      </Box>
      {vaults?.length > 0 ? (
        vaults.map(vault => (
          <VaultRow key={vault.id} vault={vault} css={{ mb: '$sm' }} />
        ))
      ) : (
        <Box
          css={{
            background: '$surfaceGray',
            padding: '$lg',
            borderRadius: '$2',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          There are no vaults in your organization yet.
        </Box>
      )}
      {modal === 'create' && <CreateVaultModal onClose={closeModal} />}
    </Box>
  );
};

export default VaultsPage;
