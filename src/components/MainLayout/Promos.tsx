import { useState } from 'react';

import { pulseStyles } from 'features/nav/SideNav';
import { NavLink } from 'react-router-dom';

import { paths } from 'routes/paths';
import { Button, Flex, Modal } from 'ui';

export const Promos = () => {
  const [modal, setModal] = useState(true);
  const closeModal = () => {
    window.localStorage.setItem('cosoulPromo', 'hidden');
    setModal(false);
  };
  const suppressCosoulPromo =
    window.localStorage.getItem('cosoulPromo') === 'hidden';
  return (
    <>
      {!suppressCosoulPromo && (
        <Modal
          loader
          open={modal}
          onOpenChange={() => closeModal()}
          title="CoSoul Launched!"
        >
          <Flex column css={{ gap: '$1xl' }}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/8plwv25NYRo?controls=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <Flex column css={{ gap: '$md' }}>
              <Button
                as={NavLink}
                to={paths.cosoul}
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
                onClick={() => closeModal()}
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
