import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

import { rWalletAuth } from 'recoilState/app';

export const useCheckLogin = () => {
  const { address, authTokens } = useRecoilValue(rWalletAuth);
  const token = address ? authTokens[address] : null;

  console.log('useCheckLogin:', token); // eslint-disable-line

  const query = useQuery(
    ['CheckLogin', token],
    () =>
      fetch('/api/login-status', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }).then(r => r.json()),
    { suspense: true, enabled: !!token }
  );

  return token ? query : { data: { loggedIn: false } };
};
