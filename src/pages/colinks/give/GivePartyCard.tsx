import React, { useState } from 'react';

import { DrawerModal } from '../../../ui/DrawerModal';
import { GiveParty } from '../../GiveParty';
import { GemCoOutline } from 'icons/__generated';
import { Flex, Text } from 'ui';

import { LearnCard, contentStyles } from './LearnCard';

export const GivePartyCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        image="/imgs/background/login-lake.jpg"
        onClick={() => setModalVisible(true)}
      >
        <Flex
          column
          css={{
            ...contentStyles,
          }}
        >
          <GemCoOutline size="2xl" fa />
          <Text>GIVE Party, Start a giveParty</Text>
        </Flex>
      </LearnCard>
      {modalVisible && (
        <DrawerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <GiveParty />
        </DrawerModal>
      )}
    </>
  );
};
