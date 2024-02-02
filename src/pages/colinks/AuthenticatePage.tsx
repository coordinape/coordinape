import { useEffect, useRef, useState } from 'react';

import { useTokenLogin } from 'features/auth/useTokenLogin';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { LoadingModal } from '../../components';

import { NotFound } from './NotFound';

export const AuthenticatePage = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [error, setError] = useState<string | undefined>();
  const hasRunOnce = useRef(false);
  const { tokenLogin } = useTokenLogin();

  useEffect(() => {
    if (hasRunOnce.current) {
      return;
    }

    const login = async () => {
      if (token) {
        await tokenLogin(token);
      }
    };
    hasRunOnce.current = true;
    login()
      .then(() => {
        navigate('/home');
      })
      .catch(() => {
        // TODO: replace this with a full screen error page
        setError(
          'This link is invalid or has already been used. Try creating a new mobile login link.'
        );
      });
  }, []);

  if (error) {
    return <NotFound header={'Invalid Login Link'}>{error}</NotFound>;
  }
  return <LoadingModal visible={true} text={'Authenticating your device'} />;
};
