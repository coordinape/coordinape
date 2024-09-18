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
          }}
        >
          <GemCoOutline size="2xl" fa />
          <Text>What is GIVE?</Text>
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
