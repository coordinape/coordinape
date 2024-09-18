import React, { useState } from 'react';

import { Flex, Text } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';
import { GemCoOutline } from 'icons/__generated';

import { LearnCard, contentStyles } from './LearnCard';

export const GiveBotCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        image="/imgs/background/login-forest.jpg"
        onClick={() => setModalVisible(true)}
      >
        <Flex
          column
          css={{
            ...contentStyles,
          }}
        >
          <GemCoOutline size="2xl" fa />
          <Text>GIVEbot stuff</Text>
        </Flex>
      </LearnCard>
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
