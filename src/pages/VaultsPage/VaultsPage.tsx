import { useState } from 'react';

import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { useVaults } from 'hooks/gql/useVaults';
import { Box, Button, Modal, Panel, Text } from 'ui';
import { OrgLayout } from 'ui/layouts';

import { CreateForm } from './CreateForm';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState<'' | 'create'>('');
  const closeModal = () => setModal('');

  const currentOrg = useCurrentOrg();
  const { isLoading, data: vaults } = useVaults(Number(currentOrg.data?.id));

  return (
    <OrgLayout>
      <Box css={{ display: 'flex' }}>
        <Text css={{ fontSize: '$8', fontWeight: '$bold', flexGrow: 1 }}>
          Vaults
        </Text>
        <Button color="red" size="small" onClick={() => setModal('create')}>
          Add Vault
        </Button>
      </Box>
      {vaults && vaults?.length > 0 ? (
        vaults?.map(vault => (
          <VaultRow
            key={vault.id}
            vault={vault as GraphQLTypes['vaults']}
            css={{ mb: '$sm' }}
          />
        ))
      ) : (
        <Panel>
          {isLoading
            ? `Loading...`
            : `There are no vaults in your organization yet.`}
        </Panel>
      )}
      {modal === 'create' && (
        <Modal onClose={closeModal} title="Create a New Vault">
          <CreateForm onSuccess={closeModal} />
        </Modal>
      )}
    </OrgLayout>
  );
};

export default VaultsPage;
