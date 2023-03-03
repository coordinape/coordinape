import { useState } from 'react';

import { rotate } from 'keyframes';
import { NavLink } from 'react-router-dom';

import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Flex, Button, Text, Modal, Panel, Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const MintPage = () => {
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };
  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <>
      <SingleColumnLayout css={{ m: 'auto' }}>
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Text h2 display color="secondary">
            View pGIVE
          </Text>
          <Flex css={{ width: '100%', justifyContent: 'space-around' }}>
            <Box
              css={{
                background:
                  'linear-gradient(rgb(198 219 137), rgb(34 119 127))',
                animation: `${rotate} 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%;',
                width: '400px',
                height: '400px',
                filter: 'blur(calc(400px / 5))',
              }}
            ></Box>
            <Panel>deets</Panel>
          </Flex>
          <Flex css={{ mt: '$lg', gap: '$md' }}>
            <Button
              color="secondary"
              size="large"
              as={NavLink}
              to={paths.cosoul}
            >
              CoSoul Splash Page
            </Button>
            <Button
              color="secondary"
              css={{ display: 'inline-flex', alignItems: 'center' }}
              onClick={() => setModal(true)}
            >
              Modal
            </Button>
            <Modal
              forceTheme="dark"
              open={modal}
              onOpenChange={closeModal}
              css={{ p: '$xl $md' }}
            >
              <Flex column alignItems="start" css={{ gap: '$md' }}>
                my modal content ehre
                <Button color="cta" size="large" as={NavLink} to={paths.cosoul}>
                  CoSoul Splash Page
                </Button>
              </Flex>
            </Modal>
          </Flex>
        </Flex>
      </SingleColumnLayout>
    </>
  );
};
