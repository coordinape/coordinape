/* eslint-disable jsx-a11y/media-has-caption */
import { useState } from 'react';

import { pulseStyles } from 'features/nav/SideNav';
import { NavLink } from 'react-router-dom';

import { paths } from 'routes/paths';
import { Button, Flex, Modal } from 'ui';

export const Promos = () => {
  const [modal, setModal] = useState(true);
  const closeCosoulPromoModal = () => {
    window.localStorage.setItem('cosoulPromo', 'hidden');
    setModal(false);
  };
  const suppressCosoulPromo =
    window.localStorage.getItem('cosoulPromo') === 'hidden';
  return (
    <>
      {!suppressCosoulPromo && (
        <Modal loader open={modal} onOpenChange={() => closeCosoulPromoModal()}>
          <Flex column css={{ gap: '$1xl' }}>
            <Flex
              css={{
                outline: '4px solid black',
                maxWidth: '500px',
              }}
            >
              <video
                width="100%"
                controls
                src="/imgs/background/cosoul-release.mp4"
              />
            </Flex>
            <Flex column>
              <Button
                as={NavLink}
                to={paths.cosoul}
                onClick={() => closeCosoulPromoModal()}
                size="large"
                color="cta"
                css={{
                  zIndex: 3,
                  position: 'relative',
                  borderRadius: '$3',
                  px: '$2xl',
                  margin: 'auto',
                  '&:before': {
                    ...pulseStyles,
                    borderRadius: '$3',
                  },
                  '&:after': {
                    ...pulseStyles,
                    borderRadius: '$3',
                    animationDelay: '1.5s',
                    zIndex: -1,
                  },
                }}
              >
                Mint Your CoSoul NFT
              </Button>
              <Button
                size="large"
                css={{ background: 'transparent !important' }}
                onClick={() => closeCosoulPromoModal()}
              >
                Close
              </Button>
            </Flex>
          </Flex>
        </Modal>
      )}
    </>
  );
};
