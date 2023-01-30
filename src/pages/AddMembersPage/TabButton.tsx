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
      css={{ mr: '$md' }}
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
