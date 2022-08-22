import { useEffect, useState } from 'react';

import { isUserAdmin } from 'lib/users';

import { LoadingModal } from 'components';
import { useOverviewMenuQuery } from 'components/OverviewMenu/getOverviewMenuData';
import { useContracts } from 'hooks';
import { useVaults } from 'hooks/gql/useVaults';
import {
  EXTERNAL_URL_LEARN_ABOUT_VAULTS,
  EXTERNAL_URL_YEARN_VAULTS,
} from 'routes/paths';
import { Box, Button, Flex, Link, Modal, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CreateForm } from './CreateForm';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState<'' | 'create'>('');

  const orgsQuery = useOverviewMenuQuery();
  const contracts = useContracts();

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

  const {
    refetch,
    isFetching,
    data: vaults,
  } = useVaults({ orgId: currentOrg?.id, chainId: Number(contracts?.chainId) });

  const closeModal = () => {
    refetch();
    setModal('');
  };

  const [saving, setSaving] = useState(false);

  if (orgsQuery.isLoading || orgsQuery.isIdle)
    return <LoadingModal visible note="VaultsPage" />;

  return (
    <SingleColumnLayout>
      <Box
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: '$md',
          mb: '$lg',
          flexWrap: 'wrap',
        }}
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
      <Flex
        row
        css={{
          justifyContent: 'space-between',
          alignItems: 'baseline',
          mb: '$sm',
          '@sm': {
            flexDirection: 'column',
            alignItems: 'start',
          },
        }}
      >
        <Text h1 css={{ '@sm': { mb: '$sm' } }}>
          {currentOrg?.name} Vaults
        </Text>
        {isAdmin && (
          <Button
            color="primary"
            css={{ whiteSpace: 'nowrap' }}
            outlined
            onClick={() => setModal('create')}
          >
            Create Vault
          </Button>
        )}
      </Flex>
      <Text
        p
        as="p"
        css={{
          mb: '$lg',
          width: '50%',
          '@sm': { width: '100%' },
        }}
      >
        Manage Vaults and fund circles with fixed and peer reward payments.
      </Text>
      {vaults && vaults?.length > 0 ? (
        vaults?.map(vault => (
          <VaultRow key={vault.id} vault={vault} css={{ mb: '$sm' }} />
        ))
      ) : (
        <>
          {isFetching ? (
            <Panel>Loading, please wait...</Panel>
          ) : (
            <Panel
              info
              css={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
                gap: '$md',
                '@sm': { gridTemplateColumns: '1fr' },
              }}
            >
              <Box>
                <Text h2 normal>
                  Welcome to CoVaults
                </Text>
              </Box>
              <Flex
                column
                css={{
                  width: '65%',
                  '@sm': { width: '100%' },
                }}
              >
                <Text p as="p" css={{ mb: '$md' }}>
                  CoVaults allow you to compensate your team by storing funds in
                  the vaults and sending payments promptly after a work cycle
                  ends.
                </Text>
                <Text p as="p" css={{ mb: '$md' }}>
                  In addition to paying your team, you can earn yield based on{' '}
                  <Link href={EXTERNAL_URL_YEARN_VAULTS} target="_blank">
                    the current APYs offered by Yearn
                  </Link>
                  . Vaults also enable you to set allowances for distributions
                  per Circle.
                </Text>
                <Box>
                  {isAdmin && (
                    <Button
                      onClick={() => setModal('create')}
                      color="primary"
                      outlined
                      inline
                      css={{ mr: '$md' }}
                    >
                      Create Vault
                    </Button>
                  )}
                  <Link href={EXTERNAL_URL_LEARN_ABOUT_VAULTS} target="_blank">
                    <Button color="primary" outlined inline css={{ mt: '$md' }}>
                      Vault Guide
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </Panel>
          )}
        </>
      )}
      {modal === 'create' && currentOrg && (
        <Modal
          showClose={!saving}
          onClose={closeModal}
          title="Create New Vault"
        >
          <CreateForm
            setSaving={setSaving}
            onSuccess={closeModal}
            orgId={currentOrg.id}
            existingVaults={vaults}
          />
        </Modal>
      )}
    </SingleColumnLayout>
  );
};

export default VaultsPage;
