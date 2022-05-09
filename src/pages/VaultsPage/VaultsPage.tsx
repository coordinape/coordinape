import { useState } from 'react';

import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

import { LoadingModal } from 'components';
import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { useVaults } from 'hooks/gql/useVaults';
import { Box, Button, Modal, Panel, Text } from 'ui';
import { OrgLayout } from 'ui/layouts';

import { CreateForm } from './CreateForm';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState<'' | 'create'>('');

  const currentOrg = useCurrentOrg();
  const { refetch, isLoading, data: vaults } = useVaults(currentOrg.data?.id);

  const closeModal = () => {
    refetch();
    setModal('');
  };

  if (isLoading || currentOrg.isLoading) return <LoadingModal visible />;

  return (
    <OrgLayout>
      <Box css={{ display: 'flex' }}>
        <Text variant="sectionHeader" css={{ flexGrow: 1 }}>
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
        <Panel>There are no vaults in your organization yet.</Panel>
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
