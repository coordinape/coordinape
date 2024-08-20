import assert from 'assert';
import { useEffect, useState } from 'react';

import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { TokenJoinInfo } from '../../../_api/join/[token]';
import { ShareTokenType } from '../../common-lib/shareTokens';
import { LoadingModal } from '../../components';
import { givePaths } from '../../routes/paths';
import { CenteredBox, Panel, Text } from '../../ui';
import useConnectedAddress from 'hooks/useConnectedAddress';

import { AddressIsNotMember } from './AddressIsNotMember';
import { JoinWithInviteLink } from './JoinWithInviteLink';
import {
  getProfilesWithAddress,
  QUERY_KEY_PROFILE_BY_ADDRESS,
} from './queries';

export const JoinPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [tokenError, setTokenError] = useState<string | undefined>();
  const [wrongAddress, setWrongAddress] = useState<boolean | undefined>(
    undefined
  );
  const [tokenJoinInfo, setTokenJoinInfo] = useState<
    TokenJoinInfo | undefined
  >();

  const address = useConnectedAddress();

  // FIXME could use useLoginData here instead
  const { data: profile } = useQuery(
    [QUERY_KEY_PROFILE_BY_ADDRESS, address],
    () => {
      assert(address);
      return getProfilesWithAddress(address);
    },
    {
      enabled: !!address,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      notifyOnChangeProps: ['data', 'error'],
    }
  );

  useEffect(() => {
    try {
      fetch('/api/join/' + token).then(res => {
        if (!res.ok) {
          setTokenError(
            'Invalid invite link; check with your admin for an updated link.'
          );
          return;
        }
        res.json().then((info: TokenJoinInfo) => {
          setTokenJoinInfo(info);
        });
      });
    } catch (e) {
      if (e instanceof Error) {
        setTokenError(e.message ?? 'unknown error');
      } else {
        setTokenError('Invalid token or network error');
      }
    }
  }, []);

  useEffect(() => {
    if (profile && tokenJoinInfo) {
      const circleId = tokenJoinInfo.circle?.id;
      if (circleId && profile?.users.some(u => u.circle_id === circleId)) {
        navigate(givePaths.circle(tokenJoinInfo.circle?.id), {
          replace: true,
        });
        return;
      }

      const orgId = tokenJoinInfo.organization?.id;
      if (orgId && profile?.org_members.some(m => m.org_id === orgId)) {
        navigate(givePaths.organization(tokenJoinInfo.organization?.id), {
          replace: true,
        });
        return;
      }

      if (tokenJoinInfo.type === ShareTokenType.Welcome) {
        setWrongAddress(true);
        return;
      }
    }
  }, [tokenJoinInfo, profile]);

  // Waiting to validate the token
  if (!tokenError && !tokenJoinInfo) {
    return <LoadingModal visible={true} note="token-lookup" />;
  }

  if (address && profile && tokenJoinInfo && wrongAddress) {
    return (
      <AddressIsNotMember
        address={address}
        tokenJoinInfo={tokenJoinInfo}
        users={profile?.users}
      />
    );
  }

  return (
    <>
      {tokenError && (
        <CenteredBox>
          <Text
            h2
            css={{ mb: '$lg', textAlign: 'center', justifyContent: 'center' }}
          >
            Error
          </Text>
          <Panel nested>{tokenError}</Panel>
        </CenteredBox>
      )}
      {tokenJoinInfo && (
        <JoinWithInviteLink tokenJoinInfo={tokenJoinInfo} profile={profile} />
      )}
    </>
  );
};

export default JoinPage;
