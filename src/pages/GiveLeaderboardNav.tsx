import { NavLink } from 'react-router-dom';

import {
  GemCoFillSm,
  StarShooting,
  Stars,
  TimelineList,
  Timer,
} from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Button } from 'ui';

import {
  activeTabStyles,
  navContainerStyles,
  tabStyles,
} from './colinks/CoLinksProfilePage/ProfileNav';

export const GiveLeaderboardNav = () => {
  return (
    <Flex
      css={{
        ...navContainerStyles,
      }}
    >
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.root}
        css={{
          ...tabStyles,
          ...(location.pathname == coLinksPaths.root && {
            ...activeTabStyles,
          }),
        }}
      >
        <GemCoFillSm fa size="lg" />
        Home
      </Button>
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.give}
        css={{
          ...tabStyles,
          ...(location.pathname === coLinksPaths.give && {
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
        to={coLinksPaths.topGive}
        css={{
          ...tabStyles,
          ...(location.pathname === coLinksPaths.topGive && {
            ...activeTabStyles,
          }),
        }}
      >
        <TimelineList fa size="lg" />
        Top GIVE
      </Button>
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.giveReceivers}
        css={{
          ...tabStyles,
          ...(location.pathname === coLinksPaths.giveReceivers && {
            ...activeTabStyles,
          }),
        }}
      >
        <Stars fa size="lg" /> Receivers
      </Button>
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.giveSenders}
        css={{
          ...tabStyles,
          ...(location.pathname === coLinksPaths.giveSenders && {
            ...activeTabStyles,
          }),
        }}
      >
        <StarShooting fa size="lg" /> Senders
      </Button>
    </Flex>
  );
};
