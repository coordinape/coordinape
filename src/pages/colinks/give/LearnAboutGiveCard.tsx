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
          <Text h1>Learn about GIVE!!</Text>
        </DrawerModal>
      )}
    </>
  );
};
