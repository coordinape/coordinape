import { useEffect, useState } from 'react';

import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { isUserAdmin } from 'lib/users';

import { LoadingModal } from 'components';
import { useOverviewMenuQuery } from 'components/OverviewMenu/getOverviewMenuData';
import { useVaults } from 'hooks/gql/useVaults';
import { Box, Button, Modal, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CreateForm } from './CreateForm';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState<'' | 'create'>('');

  const orgsQuery = useOverviewMenuQuery();

  const [currentOrgId, setCurrentOrgId] = useState<number | undefined>();

  useEffect(() => {
    if (!currentOrgId && orgsQuery.data)
      setCurrentOrgId(orgsQuery.data.organizations[0].id);
  }, [orgsQuery.data]);

  const orgs = orgsQuery.data?.organizations;
  const currentOrg = orgs
    ? orgs.find(o => o.id === currentOrgId) || orgs[0]
    : undefined;
  const isAdmin = currentOrg?.circles.some(c => isUserAdmin(c.users[0]));

  const { refetch, isFetching, data: vaults } = useVaults(currentOrg?.id);

  const closeModal = () => {
    refetch();
    setModal('');
  };

  if (orgsQuery.isLoading || orgsQuery.isIdle)
    return <LoadingModal visible note="VaultsPage" />;

  return (
    <SingleColumnLayout>
      <Box
        css={{ display: 'flex', flexDirection: 'row', gap: '$md', mb: '$lg' }}
      >
        {orgs?.map(org => (
          <Button
            css={{ borderRadius: '$pill' }}
            key={org.id}
            color="neutral"
            outlined={org.id !== currentOrgId}
            onClick={() => setCurrentOrgId(org.id)}
          >
            {org.name}
          </Button>
        ))}
      </Box>
      <Box css={{ display: 'flex' }}>
        <Text h2 css={{ flexGrow: 1 }}>
          coVaults
        </Text>
        {isAdmin && (
          <Button
            color="primary"
            outlined
            size="small"
            onClick={() => setModal('create')}
          >
            Add coVault
          </Button>
        )}
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
          {isFetching
            ? 'Loading...'
            : 'There are no vaults in your organization yet.'}
        </Panel>
      )}
      {modal === 'create' && currentOrg && (
        <Modal onClose={closeModal} title="Create a New coVault">
          <CreateForm onSuccess={closeModal} orgId={currentOrg.id} />
        </Modal>
      )}
    </SingleColumnLayout>
  );
};

export default VaultsPage;
