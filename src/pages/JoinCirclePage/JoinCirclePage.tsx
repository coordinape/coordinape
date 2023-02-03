import assert from 'assert';
import { useEffect, useState } from 'react';

import { useAuthStateMachine } from 'features/auth/RequireAuth';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { CircleTokenType } from '../../common-lib/circleShareTokens';
import { LoadingModal } from '../../components';
import { paths } from '../../routes/paths';
import { CenteredBox, Panel, Text } from '../../ui';
import useConnectedAddress from 'hooks/useConnectedAddress';

import { AddressIsNotMember } from './AddressIsNotMember';
import { JoinWithInviteLink } from './JoinWithInviteLink';
import {
  getProfilesWithAddress,
  QUERY_KEY_PROFILE_BY_ADDRESS,
} from './queries';

export const JoinCirclePage = () => {
  useAuthStateMachine(false);
  const { token } = useParams();

  const navigate = useNavigate();
  const address = useConnectedAddress();

  const [tokenError, setTokenError] = useState<string | undefined>();
  const [wrongAddress, setWrongAddress] = useState<boolean | undefined>(
    undefined
  );
  const [tokenJoinInfo, setTokenJoinInfo] = useState<
    TokenJoinInfo | undefined
  >();

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

  const alreadyMember = (circleId: number) =>
    profile?.users.some(u => u.circle_id === circleId);

  useEffect(() => {
    try {
      fetch('/api/circle/landing/' + token).then(res => {
        if (!res.ok) {
          setTokenError(
            'Invalid invite link; check with your Circle Admin for an updated link.'
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
      if (alreadyMember(tokenJoinInfo.circle.id)) {
        // shoot them off the history page
        navigate(paths.history(tokenJoinInfo.circle.id));
        return;
      } else {
        // eslint-disable-next-line no-console
        console.log('not a member', profile);
      }

      if (tokenJoinInfo.type === CircleTokenType.Welcome) {
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

export default JoinCirclePage;
