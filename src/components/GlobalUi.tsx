import { useRecoilValue } from 'recoil';

import { LoadingModal } from 'components/index';
import { rGlobalLoading } from 'recoilState';

export const GlobalUi = () => {
  const globalLoading = useRecoilValue(rGlobalLoading);
  return <LoadingModal visible={globalLoading > 0} note="global" />;
};
