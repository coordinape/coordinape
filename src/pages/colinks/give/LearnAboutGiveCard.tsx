import React, { useState } from 'react';

import { Text } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';

import { LearnCard } from './LearnCard';

export const LearnAboutGiveCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        title="How Else Can you GIVE?"
        message="you can do stuff"
        buttonTitle={'Learm More'}
        image="/imgs/background/colink-sniped.jpg"
        onClick={() => setModalVisible(true)}
      />
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
