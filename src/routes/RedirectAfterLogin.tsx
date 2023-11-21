import { Navigate, useLocation, useSearchParams } from 'react-router-dom';

import { DebugLogger } from '../common-lib/log';

const logger = new DebugLogger('routes');

export const RedirectAfterLogin = () => {
  const [params] = useSearchParams();
  return <Redirect to={params.get('next') || '/'} note="RedirectAfterLogin" />;
};
export const Redirect = ({ to, note = '' }: { to: string; note?: string }) => {
  const location = useLocation();
  logger.log(`redirecting ${location.pathname} -> ${to} | ${note}`);
  return <Navigate to={to} replace />;
};
