import { useEffect, useRef } from 'react';

import { useTokenLogin } from 'features/auth/useTokenLogin';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Text } from '../../ui';

export const AuthenticatePage = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const hasRunOnce = useRef(false);
  const { tokenLogin } = useTokenLogin();

  useEffect(() => {
    if (hasRunOnce.current) {
      return;
    }

    const login = async () => {
      if (token) {
        await tokenLogin(token);
        navigate('/home');
      }
    };
    hasRunOnce.current = true;
    login();
  }, []);

  return (
    <Text display color="complete">
      Authenticating your device...
      <LoadingIndicator />
    </Text>
  );
};
