import React, { ReactNode } from 'react';

import { Button } from '../../ui';

export const enum Tab {
  ETH,
  CSV,
  LINK,
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
      color={currentTab === tab ? 'secondary' : undefined}
      // outlined={currentTab == tab ? undefined : true}
      css={{ borderRadius: '$pill', mr: '$md' }}
      onClick={() => setCurrentTab(tab)}
    >
      {children}
    </Button>
  );
};

export default TabButton;
