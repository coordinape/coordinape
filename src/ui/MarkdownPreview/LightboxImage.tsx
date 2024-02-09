import { useState } from 'react';

import { Eye } from 'icons/__generated';
import { Text, Modal, Image } from 'ui';

export const LightboxImage = ({ src, alt }: { src: string; alt: string }) => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Text
        onClick={() => setModal(true)}
        css={{
          display: 'block',
          width: 'fit-content',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url('${src})`,
          '&:hover, &:focus': {
            '.lightboxButton': {
              left: -50,
              top: -50,
            },
          },
        }}
      >
        <Image src={src} alt={alt} />
        <Text
          className="lightboxButton"
          css={{
            display: 'flex',
            background: '$surface',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            left: -100,
            top: -100,
            transform: 'rotate(-45deg)',
            transition: 'all .2s ease-in-out',
          }}
        >
          <Eye
            size="lg"
            css={{
              transform: 'rotate(45deg)',
              position: 'absolute',
              bottom: 10,
            }}
          />
        </Text>
      </Text>
      <Modal
        lightbox
        showClose={false}
        open={modal}
        onOpenChange={() => setModal(false)}
      >
        <Text onClick={() => setModal(false)}>
          <Image src={src} alt={alt} />
        </Text>
      </Modal>
    </>
  );
};
