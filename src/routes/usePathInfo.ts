import { useLocation } from 'react-router-dom';

import { isCircleSpecificPath, isOrgSpecificPath } from './paths';

export const usePathContext = () => {
  const location = useLocation();
  return {
    inCircle: isCircleSpecificPath(location),
    inOrg: isOrgSpecificPath(location),
  };
};
