import { useEffect, useState } from 'react';

import { useIsEmailWallet } from 'features/auth';
import { isUserAdmin } from 'lib/users';
import { useRecoilValueLoadable } from 'recoil';

import { LoadingModal } from 'components';
import HintBanner from 'components/HintBanner';
import { useMainHeaderQuery } from 'components/MainLayout/getMainHeaderData';
import { useContracts } from 'hooks';
import { useVaults } from 'hooks/gql/useVaults';
import useRequireSupportedChain from 'hooks/useRequireSupportedChain';
import { rSelectedCircleId } from 'recoilState/app';
import { Box, Button, Flex, Link, Modal, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CreateForm } from './CreateForm';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState(false);

  const circleId = useRecoilValueLoadable(rSelectedCircleId).valueMaybe();
  const orgsQuery = useMainHeaderQuery();
  const contracts = useContracts();

  const [currentOrgId, setCurrentOrgId] = useState<number | undefined>();

  useRequireSupportedChain();

  useEffect(() => {
    const orgIndex = circleId
      ? orgsQuery?.data?.organizations.findIndex(o =>
          o.circles.some(c => c.id === circleId)
        )
      : 0;

    if (!currentOrgId && orgsQuery.data)
      setCurrentOrgId(orgsQuery.data.organizations[orgIndex ?? 0].id);
  }, [orgsQuery.data]);

  const orgs = orgsQuery.data?.organizations;
  const currentOrg = orgs
    ? orgs.find(o => o.id === currentOrgId) || orgs[0]
    : undefined;
  const isAdmin = !!currentOrg?.circles.some(c => isUserAdmin(c.users[0]));

  const {
    refetch,
    isLoading,
    data: vaults,
  } = useVaults({ orgId: currentOrg?.id, chainId: Number(contracts?.chainId) });

  const closeModal = () => {
    refetch();
    setModal(false);
  };

  const [saving, setSaving] = useState(false);
  const isEmailWallet = useIsEmailWallet();

  if (orgsQuery.isLoading || orgsQuery.isIdle)
    return <LoadingModal visible note="VaultsPage" />;

  return (
    <SingleColumnLayout>
      {isEmailWallet && (
        <HintBanner title="Email-Based Wallets Not Recommended" type="alert">
          <p>You are logged in with an email-based wallet.</p>
          <p>
            It is not recommended to create a vault with one of these wallets.
            Instead, you can{' '}
            <a
              target="_blank"
              href="https://docs.coordinape.com/info/documentation/email-login-and-web3-best-practices"
              rel="noreferrer"
            >
              export this wallet
            </a>
            , or log in with a different wallet.
          </p>
        </HintBanner>
      )}
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
            color="secondary"
            css={{ whiteSpace: 'nowrap' }}
            onClick={() => setModal(true)}
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
      {isLoading ? (
        <Panel>Loading, please wait...</Panel>
      ) : (vaults?.length || 0) > 0 ? (
        vaults?.map(vault => (
          <VaultRow key={vault.id} vault={vault} css={{ mb: '$sm' }} />
        ))
      ) : (
        <NoVaults isAdmin={isAdmin} createVault={() => setModal(true)} />
      )}
      {currentOrg && (
        <Modal
          drawer
          showClose={!saving}
          open={modal}
          onOpenChange={() => !saving && closeModal()}
          title="Create New Vault"
        >
          <CreateForm
            setSaving={setSaving}
            onSuccess={closeModal}
            orgId={currentOrg?.id}
          />
        </Modal>
      )}
    </SingleColumnLayout>
  );
};

export default VaultsPage;

const NoVaults = ({
  isAdmin,
  createVault,
}: {
  isAdmin: boolean;
  createVault: () => void;
}) => {
  return (
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
          CoVaults allow you to compensate your team by storing funds in the
          vaults and sending payments promptly after a work cycle ends.
        </Text>
        <Text p as="p" css={{ mb: '$md' }}>
          In addition to paying your team, you can earn yield based on{' '}
          <Link inlineLink href="https://yearn.finance/vaults" target="_blank">
            the current APYs offered by Yearn
          </Link>
          . Vaults also enable you to set allowances for distributions per
          Circle.
        </Text>
        <Box>
          {isAdmin && (
            <Button
              onClick={createVault}
              color="secondary"
              inline
              css={{ mr: '$md' }}
            >
              Create Vault
            </Button>
          )}
          <Link
            href="https://docs.coordinape.com/get-started/organizations/vaults"
            target="_blank"
          >
            <Button color="secondary" inline css={{ mt: '$md' }}>
              Vault Guide
            </Button>
          </Link>
        </Box>
      </Flex>
    </Panel>
  );
};
