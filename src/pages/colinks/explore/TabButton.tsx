import { ComponentProps, ReactNode } from 'react';

import { Button } from '../../../ui';

export const enum Tab {
  NEWEST,
  MOST_LINKS,
  MOST_HOLDING,
  MOST_REPUTABLE,
}

const TabButton = ({
  tab,
  children,
  currentTab,
  setCurrentTab,
  size = 'small',
}: {
  tab: Tab;
  children: ReactNode;
  currentTab: Tab;
  setCurrentTab(tab: Tab): void;
  size?: ComponentProps<typeof Button>['size'];
}) => {
  return (
    <Button
      key={tab}
      size={size}
      color={currentTab == tab ? 'selectedSecondary' : 'secondary'}
      onClick={() => setCurrentTab(tab)}
    >
      {children}
    </Button>
  );
};

export default TabButton;
