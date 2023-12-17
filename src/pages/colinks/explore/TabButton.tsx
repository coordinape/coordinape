import { ReactNode } from 'react';

import { Button } from '../../../ui';

export const enum Tab {
  MOST_LINKS,
  MOST_HOLDING,
  MOST_REPUTABLE,
  POSTS,
  PROFILES,
}

const TabButton = ({
  tab,
  children,
  currentTab,
  setCurrentTab,
}: {
  tab: Tab;
  children: ReactNode;
  currentTab: Tab;
  setCurrentTab(tab: Tab): void;
}) => {
  return (
    <Button
      key={tab}
      size="small"
      color={currentTab == tab ? 'selectedSecondary' : 'secondary'}
      onClick={() => setCurrentTab(tab)}
    >
      {children}
    </Button>
  );
};

export default TabButton;
