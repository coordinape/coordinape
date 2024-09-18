import React, { useState } from 'react';

import { Flex, Text } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';
import { MessageHeartOutline } from 'icons/__generated';

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
            justifyContent: 'space-between',
            background:
              'radial-gradient(circle at 25% 0%, rgb(20 154 204 / 53%) 20%, rgb(231 7 132 / 53%) 100%)',
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
            <MessageHeartOutline size="2xl" fa />
            <Text size="large" semibold css={{ textAlign: 'center' }}>
              Try @givebot
            </Text>
          </Flex>
          <Flex
            column
            css={{
              alignItems: 'center',
              gap: '$sm',
              background:
                'radial-gradient(circle at 25% 0%, rgb(0 110 196) 20%, rgb(180, 22, 110) 100%)',
              p: '$sm',
              width: '100%',
            }}
          >
            <Text size="small" css={{ textAlign: 'center' }}>
              You can easily GIVE to anyone <br /> on Farcaster with @givebot
            </Text>
          </Flex>
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
