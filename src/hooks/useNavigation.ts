import React from 'react';

import { useHistory } from 'react-router';

import * as paths from 'routes/paths';

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
  const history = useHistory();

  const go = (path: string, e?: React.MouseEvent<any>) => {
    if (e?.ctrlKey || e?.metaKey) {
      window.open(path, '_blank');
    } else {
      history.push(path);
    }
  };

  const handlerFromGetter =
    <P>(get: (p: P) => string) =>
    (p: P) =>
    (e?: React.MouseEvent<any>) =>
      go(get(p), e);

  return {
    getToMap: handlerFromGetter(paths.getMapPath),
    getToProfile: handlerFromGetter(paths.getProfilePath),
  };
};
