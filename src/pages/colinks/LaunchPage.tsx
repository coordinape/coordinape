import { useEffect } from 'react';

import { useNavigate } from 'react-router';
import { useAccount } from 'wagmi';

import { LoadingModal } from '../../components';
import useProfileId from '../../hooks/useProfileId';
import { coLinksPaths } from '../../routes/paths';

// Routes recently logged in users to either the colinks app or the colinks wizard
export const LaunchPage = () => {
  const { isConnected } = useAccount();

  const profileId = useProfileId();

  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    // get a new wallet connection
    if (!isConnected || !profileId) {
      navigate(coLinksPaths.give, {
        replace: true,
      });
    } else {
      navigate(coLinksPaths.home, {
        replace: true,
      });
    }
  }, [address, isConnected, profileId]);

  return <LoadingModal visible={true} />;
};
