import React from 'react';

import { useNavigate } from 'react-router';

import { paths } from 'routes/paths';

/**
 * Access parameterized app navigation.
 *
 * @returns functions that create onClick handlers.
 *
 * Example:
 * const { getToMap } = useNavigation();
 * ...
 * return (<Button onClick={getToMap({hightlight: '0x5453424324bbbecdea'})}>To map</Button>);
 *
 * The handler will respond to crtl & meta click for new window.
 */
export const useNavigation = () => {
  const navigate = useNavigate();

  const go = (path: string, e?: React.MouseEvent<any>) => {
    if (e?.ctrlKey || e?.metaKey) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  const handlerFromGetter =
    <P>(get: (p: P) => string) =>
    (p: P) =>
    (e?: React.MouseEvent<any>) =>
      go(get(p), e);

  return {
    getToMap: handlerFromGetter(paths.map),
    getToProfile: handlerFromGetter(paths.profile),
  };
};
