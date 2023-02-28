import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Flex, Button, Text, Modal } from 'ui';
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
          <Text color="cta" h1 css={{ fontSize: '110px' }}>
            View pGIVE
          </Text>
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
