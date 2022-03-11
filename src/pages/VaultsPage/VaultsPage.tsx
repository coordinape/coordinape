import { useState } from 'react';

import { useCurrentOrg } from 'hooks/gql';
import { useVaults } from 'recoilState/vaults';
import { Box, Button, Panel, Text } from 'ui';
import { OrgLayout } from 'ui/layouts';

import { CreateModal } from './CreateModal';
// eslint-disable-next-line import/no-named-as-default
import CreateVaultModal from './CreateVaultModal';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState<'' | 'create' | 'create2'>('');
  const closeModal = () => setModal('');

  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg?.id);

  return (
    <OrgLayout>
      <Box css={{ display: 'flex' }}>
        <Text css={{ fontSize: '$8', fontWeight: '$bold', flexGrow: 1 }}>
          Vaults
        </Text>
        <Button color="red" size="small" onClick={() => setModal('create')}>
          Add Vault
        </Button>
        <Button color="red" size="small" onClick={() => setModal('create2')}>
          Add Vault 2
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
      {modal === 'create2' && <CreateModal onClose={closeModal} />}
    </OrgLayout>
  );
};

export default VaultsPage;
