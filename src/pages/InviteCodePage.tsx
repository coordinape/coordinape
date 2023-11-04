import Cookies from 'js-cookie';
import { Navigate, useParams } from 'react-router-dom';

import { INVITE_CODE_COOKIE } from '../features/invites/invitecodes';
import { paths } from '../routes/paths';

export const InviteCodePage = () => {
  const { code } = useParams();

  console.log('INVITEPAGE!!!');
  if (code) {
    console.log('INVITEPAGE.SETCOOKIE!!!', code);
    Cookies.set(INVITE_CODE_COOKIE, code, { expires: 1 });
  }
  return <Navigate to={paths.soulKeys} />;
};
