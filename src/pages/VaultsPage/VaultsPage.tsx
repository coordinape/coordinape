import { useState } from 'react';

import { useIsEmailWallet } from 'features/auth';
import TermsGate from 'features/auth/TermsGate';
import { useParams } from 'react-router-dom';

import { LoadingModal } from 'components';
import HintBanner from 'components/HintBanner';
import { useMainHeaderQuery } from 'components/MainLayout/getMainHeaderData';
import { useContracts } from 'hooks';
import { useVaults } from 'hooks/gql/useVaults';
import useRequireSupportedChain from 'hooks/useRequireSupportedChain';
import { ContentHeader, Flex, Link, Modal, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CreateForm } from './CreateForm';
import { VaultRow } from './VaultRow';

const VaultsPage = () => {
  const [modal, setModal] = useState(false);

  const orgsQuery = useMainHeaderQuery();
  const contracts = useContracts();

  const { orgId: orgFromParams } = useParams();
  const specificOrg = orgFromParams ? Number(orgFromParams) : undefined;

  useRequireSupportedChain();

  const {
    refetch,
    isLoading,
    data: vaults,
  } = useVaults({ orgId: specificOrg, chainId: Number(contracts?.chainId) });

  const closeModal = () => {
    refetch();
    setModal(false);
  };

  const [saving, setSaving] = useState(false);

  const isEmailWallet = useIsEmailWallet();

  if (orgsQuery.isLoading || orgsQuery.isIdle)
    return <LoadingModal visible note="VaultsPage" />;

  const orgs = orgsQuery.data?.organizations;
  const currentOrg = orgs ? orgs.find(o => o.id === specificOrg) : undefined;

  return (
    <TermsGate>
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
        <ContentHeader>
          <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
            <Text h1>{currentOrg?.name} Vaults</Text>
            <Text p as="p">
              Manage Vaults and fund circles with fixed and peer reward
              payments.
            </Text>
          </Flex>
        </ContentHeader>
        <NoVaults />

        {isLoading ? (
          <Panel>
            <Text>Loading, please wait...</Text>
          </Panel>
        ) : (
          vaults?.map(vault => (
            <VaultRow key={vault.id} vault={vault} css={{ mb: '$sm' }} />
          ))
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
    </TermsGate>
  );
};

export default VaultsPage;

const NoVaults = () => {
  return (
    <HintBanner title={'Vaults Deprecation Notice'} type="alert">
      <Text p as="p" css={{ color: 'warning' }}>
        <b>Vaults will be closing soon.</b>
        <br />
        Please avoid or complete pending distributions, ask all claimants to
        complete claims, withdraw any unused tokens, and discontinue the use of
        Vaults.
      </Text>
    </HintBanner>
  );
};
