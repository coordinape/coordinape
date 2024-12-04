import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { ShareGiveThick, TimelineList, Timer } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Button } from 'ui';
import { DrawerModal } from 'ui/DrawerModal';

import {
  activeTabStyles,
  navContainerStyles,
  tabStyles,
} from './colinks/CoLinksProfilePage/ProfileNav';
import { ShareGiveContent } from './colinks/give/ShareGiveCard';

export const GiveSkillNav = ({ skill }: { skill: string }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Flex
      css={{
        ...navContainerStyles,
      }}
    >
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.giveSkill(skill)}
        css={{
          ...tabStyles,
          ...(location.pathname.includes('/skill/') && {
            ...activeTabStyles,
          }),
        }}
      >
        <Timer fa size="lg" />
        Recent GIVE
      </Button>
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.giveSkillLeaderboard(skill)}
        css={{
          ...tabStyles,
          ...(location.pathname.includes('/leaderboard/') && {
            ...activeTabStyles,
          }),
        }}
      >
        <TimelineList fa size="lg" /> Leaderboard
      </Button>
      <Button
        color="textOnly"
        onClick={() => setModalVisible(prev => !prev)}
        css={{
          ...tabStyles,
        }}
      >
        <ShareGiveThick fa size="lg" /> Share
      </Button>
      {modalVisible && (
        <DrawerModal
          visible={modalVisible}
          closeButtonStyles={{ color: '$white80' }}
          onClose={() => setModalVisible(prev => !prev)}
        >
          <ShareGiveContent skill={skill} />
        </DrawerModal>
      )}
    </Flex>
  );
};
