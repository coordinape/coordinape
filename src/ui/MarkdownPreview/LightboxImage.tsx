import { useState } from 'react';

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
