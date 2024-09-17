import React, { useState } from 'react';

import { Flex, Text } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';

import { LearnCard } from './LearnCard';

export const GiveBotCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        backgroundImage="imgs/frames/help.jpg"
        css={{ height: '140px' }}
        onClick={() => setModalVisible(true)}
      />
      {modalVisible && (
        <DrawerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <GiveBotModalContents />
        </DrawerModal>
      )}
    </>
  );
};

const GiveBotModalContents = () => {
  return (
    <Flex
      column
      css={{
        p: '$lg',
        gap: '$xl',
      }}
    >
      <Text h1>Farcaster GIVE Bot</Text>
      You can use our GIVE Bot on our Farcaster by simply tagging @givebot in a
      reply to any cast.
    </Flex>
  );
};
