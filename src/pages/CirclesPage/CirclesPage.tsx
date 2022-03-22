import React, { Suspense } from 'react';

import { useRecoilValueLoadable } from 'recoil';

import { CirclesHeaderSection, MenuNavigationLinks } from 'components';
import { useMyProfile, rSelectedCircle } from 'recoilState/app';
import { useSetCircleSelectorOpen } from 'recoilState/ui';
import { Box } from 'ui';

export const CirclesPage = () => {
  const myProfile = useMyProfile();

  const { hasAdminView } = myProfile;

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        margin: '$md auto',
        maxWidth: '$mediumScreen',
        '> *': {
          ml: '0 !important',
        },
      }}
    >
      <Box css={{ fontWeight: 'bold' }}>
        Placeholder Layout{' '}
        <span role="img" aria-label="Under Construction">
          🚧
        </span>
      </Box>
      <MenuNavigationLinks />
      <Suspense fallback={null}>
        <CirclesHeaderSection />
      </Suspense>
      {hasAdminView && (
        <>
          <CirclesSelectorSection />
        </>
      )}
    </Box>
  );
};

export const CirclesSelectorSection = (props: { handleOnClick?(): void }) => {
  const setCircleSelectorOpen = useSetCircleSelectorOpen();
  const selectedCircle = useRecoilValueLoadable(rSelectedCircle).valueMaybe();

  const handleOnClick = () => {
    if (props.handleOnClick) {
      props.handleOnClick();
    }
    setCircleSelectorOpen(true);
  };

  return (
    <div>
      <span>Admin View</span>
      {selectedCircle && selectedCircle.impersonate ? (
        <>
          <button onClick={props.handleOnClick}>
            {selectedCircle.circle.name}
          </button>
          <button onClick={handleOnClick}>Circle Selector</button>
        </>
      ) : (
        <button onClick={handleOnClick}>Circle Selector</button>
      )}
    </div>
  );
};

export default CirclesPage;
