import { useEffect, useState } from 'react';

import { useIsEmailWallet } from 'features/auth';
import { isUserAdmin } from 'lib/users';
import { Contracts } from 'lib/vaults';
import { useParams } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { LoadingModal } from 'components';
import HintBanner from 'components/HintBanner';
import {
  MainHeaderOrgs,
  useMainHeaderQuery,
} from 'components/MainLayout/getMainHeaderData';
import { useContracts } from 'hooks';
import { useVaults } from 'hooks/gql/useVaults';
import useRequireSupportedChain from 'hooks/useRequireSupportedChain';
import { rSelectedCircleId } from 'recoilState/app';
import { Box, Button, ContentHeader, Flex, Link, Modal, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CreateForm } from './CreateForm';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const circleId = useRecoilValueLoadable(rSelectedCircleId).valueMaybe();
  const orgsQuery = useMainHeaderQuery();
  const contracts = useContracts();

  const { orgId: orgFromParams } = useParams();
  const specificOrg = orgFromParams ? Number(orgFromParams) : undefined;

  useRequireSupportedChain();

  if (orgsQuery.isLoading || orgsQuery.isIdle || orgsQuery.isFetching)
    return <LoadingModal visible note="VaultsPage" />;

  return (
    <VaultsSelect
      circleId={circleId}
      orgId={specificOrg}
      orgs={orgsQuery?.data?.organizations}
      contracts={contracts}
    />
  );
};

const VaultsSelect = ({
  circleId,
  orgId: specificOrg,
  orgs,
  contracts,
}: {
  circleId?: number;
  orgId?: number;
  orgs?: MainHeaderOrgs;
  contracts?: Contracts;
}) => {
  const [modal, setModal] = useState(false);

  const [currentOrgId, setCurrentOrgId] = useState<number | undefined>(
    specificOrg
  );

  useEffect(() => {
    const orgIndex = circleId
      ? orgs?.findIndex(o => o.circles.some(c => c.id === circleId))
      : 0;

    if (!currentOrgId && orgs) setCurrentOrgId(orgs[orgIndex ?? 0].id);
  }, [orgs]);

  const currentOrg = orgs
    ? orgs.find(o => o.id === currentOrgId) || orgs[0]
    : undefined;

  const {
    refetch,
    isLoading,
    data: vaults,
  } = useVaults({ orgId: currentOrg?.id, chainId: Number(contracts?.chainId) });

  const isAdmin = !!currentOrg?.circles.some(c => isUserAdmin(c.users[0]));

  const closeModal = () => {
    refetch();
    setModal(false);
  };

  const [saving, setSaving] = useState(false);
  const isEmailWallet = useIsEmailWallet();

  return (
    <SingleColumnLayout>
      {isEmailWallet && (
        <HintBanner title="Email-Based Wallets Not Recommended" type="alert">
          <Text p as="p">
            You are logged in with an email-based wallet.
          </Text>
          <Text p as="p">
            It is not recommended to create a vault with one of these wallets.
            Instead, you can{' '}
            <Link
              inlineLink
              target="_blank"
              href="https://docs.coordinape.com/info/documentation/email-login-and-web3-best-practices"
              rel="noreferrer"
            >
              export this wallet
            </Link>
            , or log in with a different wallet.
          </Text>
        </HintBanner>
      )}
      {!specificOrg && (
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
              color={org.id === currentOrgId ? 'primary' : 'secondary'}
              onClick={() => setCurrentOrgId(org.id)}
            >
              {org.name}
            </Button>
          ))}
        </Box>
      )}
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>{currentOrg?.name} Vaults</Text>
          <Text p as="p">
            Manage Vaults and fund circles with fixed and peer reward payments.
          </Text>
        </Flex>
        {isAdmin && (
          <Button color="cta" onClick={() => setModal(true)}>
            Create Vault
          </Button>
        )}
      </ContentHeader>
      {isLoading ? (
        <Panel>
          <Text>Loading, please wait...</Text>
        </Panel>
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
    <HintBanner title={'Welcome to CoVaults'}>
      <Text p as="p" css={{ color: 'inherit' }}>
        CoVaults allow you to compensate your team by storing funds in the
        vaults and sending payments promptly after a work cycle ends.
      </Text>
      <Text p as="p" css={{ color: 'inherit' }}>
        In addition to paying your team, you can earn yield based on{' '}
        <Link inlineLink href="https://yearn.finance/vaults" target="_blank">
          the current APYs offered by Yearn
        </Link>
        . Vaults also enable you to set allowances for distributions per Circle.
      </Text>
      <Flex css={{ gap: '$md' }}>
        {isAdmin && (
          <Button onClick={createVault} color="secondary" inline>
            Create Vault
          </Button>
        )}
        <Button
          as="a"
          href="https://docs.coordinape.com/get-started/organizations/vaults"
          target="_blank"
          color="secondary"
          inline
        >
          Vault Guide
        </Button>
      </Flex>
    </HintBanner>
  );
};
