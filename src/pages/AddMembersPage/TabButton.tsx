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
      css={{ borderRadius: '$pill', mr: '$md', border: '1px solid $neutral' }}
      key={tab}
      color="neutral"
      outlined={currentTab !== tab}
      onClick={() => setCurrentTab(tab)}
    >
      {children}
    </Button>
  );
};

export default TabButton;
