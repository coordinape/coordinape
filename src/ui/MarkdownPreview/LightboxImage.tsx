import { useState } from 'react';

import { CSS } from '@stitches/react';

import { Text, Modal, Image } from 'ui';

export const LightboxImage = ({
  src,
  alt,
  css,
}: {
  src: string;
  alt: string;
  css?: CSS;
}) => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Text
        onClick={() => setModal(true)}
        className="lightboxImageWrapper"
        css={{
          display: 'block',
          width: 'fit-content',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url('${src}')`,
          cursor: 'pointer',
          ...css,
        }}
      >
        <Image src={src} alt={alt} />
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
