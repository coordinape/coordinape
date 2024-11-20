import { NavLink } from 'react-router-dom';

import { TimelineList, Timer } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Button } from 'ui';

import {
  activeTabStyles,
  navContainerStyles,
  tabStyles,
} from './colinks/CoLinksProfilePage/ProfileNav';

export const GiveSkillNav = ({ skill }: { skill: string }) => {
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
    </Flex>
  );
};
