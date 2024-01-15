import Cookies from 'js-cookie';
import { Navigate, useParams } from 'react-router-dom';

import { INREACT_APP_CODE_COOKIE } from '../features/invites/invitecodes';
import { coLinksPaths } from '../routes/paths';

export const InviteCodePage = () => {
  const { code } = useParams();

  if (code) {
    Cookies.set(INREACT_APP_CODE_COOKIE, code, { expires: 1 });
  }
  return <Navigate to={coLinksPaths.home} />;
};
