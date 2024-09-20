import React, { useState } from 'react';

import { Flex, Text } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';
import { GemCoOutline } from 'icons/__generated';

import { LearnCard, contentStyles } from './LearnCard';

export const LearnAboutGiveCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        image="/imgs/background/login-snow.jpg"
        onClick={() => setModalVisible(true)}
      >
        <Flex
          column
          css={{
            ...contentStyles,
            justifyContent: 'space-between',
            background:
              'radial-gradient(circle at 25% 0%, rgb(21 196 107 / 53%) 20%, rgb(90 5 192 / 53%) 100%)',
          }}
        >
          <Flex
            column
            css={{
              alignItems: 'center',
              gap: '$sm',
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            <GemCoOutline size="2xl" fa />
            <Text size="large" semibold css={{ textAlign: 'center' }}>
              What is GIVE?
            </Text>
          </Flex>
        </Flex>
      </LearnCard>
      {modalVisible && (
        <DrawerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <Flex
            css={{
              flexGrow: 1,
              width: '100%',
              minHeight: '250px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50% 30%',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/colink-give.jpg')",
              '@sm': {
                display: 'none',
              },
            }}
          />
          <Flex column css={{ p: '$md' }}>
            <Text h1>
              GIVE is a simple and powerful onchain way to recognize people and
              their impact, inside and outside of the Coordinape platform.
            </Text>
          </Flex>
        </DrawerModal>
      )}
    </>
  );
};
