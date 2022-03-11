import { useState } from 'react';

import { useCurrentOrg } from 'hooks/gql';
import { useVaults } from 'recoilState/vaults';
import { Box, Button, Panel, Text } from 'ui';
import { OrgLayout } from 'ui/layouts';

// eslint-disable-next-line import/no-named-as-default
import CreateVaultModal from './CreateVaultModal';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState<'' | 'create'>('');
  const closeModal = () => setModal('');

  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg?.id);

  return (
    <OrgLayout>
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
        <Panel>There are no vaults in your organization yet.</Panel>
      )}
      {modal === 'create' && <CreateVaultModal onClose={closeModal} />}
    </OrgLayout>
  );
};

export default VaultsPage;
