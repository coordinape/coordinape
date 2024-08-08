import React, { useState } from 'react';

import { DrawerModal } from '../../../ui/DrawerModal';
import { GiveParty } from '../../GiveParty';

import { LearnCard } from './LearnCard';

export const GivePartyCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        title="Give Party!!!"
        message="you can do a give party"
        buttonTitle={'Start a GIVE Party'}
        image="/imgs/background/colink-rep.jpg"
        onClick={() => setModalVisible(true)}
      />
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
