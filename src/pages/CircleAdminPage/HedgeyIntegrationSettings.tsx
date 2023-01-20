import { useEffect, useState } from 'react';

import { INTEGRATION_TYPE } from 'lib/hedgey';

import { useToast } from 'hooks';
import { Button, Flex, Modal, Select, SelectOption, Text } from 'ui';

import { createCircleIntegration, updateCircleIntegration } from './mutations';

function HedgeyIntro() {
  return (
    <>
      <Text h3 semibold css={{ mb: '$sm' }}>
        Hedgey Integration
      </Text>
      <Text p size="small" css={{ mb: '$md' }}>
        Hedgey is a protocol for locking tokens during fundraising and payroll.{' '}
        <a href="https://hedgey.finance" target="_blank" rel="noreferrer">
          Find out more
        </a>
      </Text>
    </>
  );
}

export const hedgeyLockPeriods: SelectOption[] = [
  { label: '1 month', value: '1' },
  { label: '2 months', value: '2' },
  { label: '3 months', value: '3' },
  { label: '4 months', value: '4' },
  { label: '5 months', value: '5' },
  { label: '6 months', value: '6' },
  { label: '12 months', value: '12' },
  { label: '18 months', value: '18' },
  { label: '24 months', value: '24' },
  { label: '48 months', value: '48' },
];

export default function HedgeyIntegrationSettings(props: {
  circleId: number;
  integration?: {
    id: number;
    type: string;
    data: { enabled: boolean; lockPeriod: string; transferable: string };
  };
}) {
  const [circleIntegrationId, setCircleIntegrationId] = useState(
    undefined as number | undefined
  );
  const [hedgeyEnabled, setHedgeyEnabled] = useState(false);
  const [hedgeyLockPeriod, setHedgeyLockPeriod] = useState('12');
  const [hedgeyTransferable, setHedgeyTransferable] = useState('0');
  const [showDisableModal, setShowDisableModal] = useState(false);
  const { showDefault } = useToast();

  useEffect(() => {
    setCircleIntegrationId(props.integration?.id);
    setHedgeyEnabled(props.integration?.data.enabled || false);
    setHedgeyLockPeriod(props.integration?.data.lockPeriod || '12');
    setHedgeyTransferable(props.integration?.data.transferable || '0');
  }, [props]);

  const saveIntegration = async (enabled: boolean) => {
    if (circleIntegrationId) {
      await updateCircleIntegration(circleIntegrationId, {
        enabled,
        lockPeriod: hedgeyLockPeriod,
        transferable: hedgeyTransferable,
      });
      showDefault('Saved Hedgey integration changes');
    } else {
      const { insert_circle_integrations_one } = await createCircleIntegration(
        props.circleId,
        INTEGRATION_TYPE,
        'Hedgey',
        {
          enabled,
          lockPeriod: hedgeyLockPeriod,
          transferable: hedgeyTransferable,
        }
      );
      setCircleIntegrationId(insert_circle_integrations_one?.id);
      showDefault('Created Hedgey integration');
    }
  };

  const onSaveHedgeyIntegration = async (e: any) => {
    e.preventDefault();
    await saveIntegration(true);
  };

  const onDisableHedgey = async (e: any) => {
    e.preventDefault();
    setHedgeyEnabled(false);
    setShowDisableModal(false);
    await saveIntegration(false);
  };

  if (!hedgeyEnabled) {
    return (
      <Flex css={{ flexDirection: 'column', alignItems: 'start' }}>
        <HedgeyIntro />
        <Button color="primary" outlined onClick={() => setHedgeyEnabled(true)}>
          Enable Hedgey Integration
        </Button>
      </Flex>
    );
  }

  return (
    <Flex css={{ flexDirection: 'column', alignItems: 'start' }}>
      <Flex
        css={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <HedgeyIntro />
        </div>
        <Button
          color="destructive"
          outlined
          onClick={e => {
            e.preventDefault();
            setShowDisableModal(true);
          }}
        >
          Disable integration
        </Button>
      </Flex>
      <Flex css={{ gap: '1em', marginBottom: '1em' }}>
        <Select
          label="Default lock period"
          infoTooltip="How long tokens are locked within the recipient's NFT"
          id="hedgey-default-lock-period"
          options={hedgeyLockPeriods}
          defaultValue="12"
          value={hedgeyLockPeriod}
          onValueChange={value => setHedgeyLockPeriod(value)}
        />
        <Select
          label="Transferable"
          infoTooltip="Allow the recipient to transfer their NFT (and their access to the locked tokens) to a different wallet address"
          id="hedgey-transferable"
          defaultValue="1"
          options={[
            { label: 'Yes', value: '1' },
            { label: 'No', value: '0' },
          ]}
          value={hedgeyTransferable}
          onValueChange={value => setHedgeyTransferable(value)}
        />
      </Flex>
      <Button color="primary" outlined onClick={onSaveHedgeyIntegration}>
        Save Hedgey settings
      </Button>
      <Modal
        open={showDisableModal}
        title="Disable Hedgey?"
        onOpenChange={() => setShowDisableModal(false)}
      >
        Are you sure you want to disable the Hedgey integration?
        <Button
          css={{ marginTop: '1em' }}
          color="destructive"
          onClick={onDisableHedgey}
        >
          Disable Hedgey integration
        </Button>
      </Modal>
    </Flex>
  );
}
