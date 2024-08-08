/* eslint-disable no-console */
import { useEffect, useState } from 'react';

import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Box } from '../../../ui';
import useConnectedAddress from 'hooks/useConnectedAddress';

import { ProfileHeader } from './ProfileHeader';
import { fetchCoLinksProfile } from './ProfilePagePostsContents';

export const ViewProfilePageNetwork = () => {
  const { address } = useParams();
  const currentAddress = useConnectedAddress(false);
  const [showLoading, setShowLoading] = useState(false);
  const currentUserProfileId = undefined; // todo
  const { data: targetProfile, isLoading: fetchCoLinksProfileIsLoading } =
    useQuery(
      [QUERY_KEY_COLINKS, address, 'profile'],
      () => {
        if (!address) return;
        return fetchCoLinksProfile(address, currentUserProfileId);
      },
      {
        enabled: !!address,
      }
    );

  useEffect(() => {
    console.log({
      fetchCoLinksProfileIsLoading,
      targetProfile,
      address,
      currentAddress,
    });
  }, [fetchCoLinksProfile, targetProfile, address, currentAddress]);

  if (!address) {
    return <Box>address query param required</Box>;
  }
  if (fetchCoLinksProfileIsLoading || !targetProfile) {
    return <Box>loading....</Box>;
  }
  return (
    <>
      <ProfileHeader
        showLoading={showLoading}
        setShowLoading={setShowLoading}
        target={targetProfile}
        currentUserAddress={currentAddress} // todo get address if is there
        targetAddress={address}
      />
      network here
    </>
  );
};
