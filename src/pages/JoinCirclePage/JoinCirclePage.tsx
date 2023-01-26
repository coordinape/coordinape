import assert from 'assert';
import { useEffect, useState } from 'react';

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
import { JoinWithMagicLink } from './JoinWithMagicLink';
import {
  getProfilesWithAddress,
  QUERY_KEY_PROFILE_BY_ADDRESS,
} from './queries';

export const JoinCirclePage = () => {
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
    assert(token);
    const fn = async () => {
      try {
        const res = await fetch('/api/circle/landing/' + token);
        if (!res.ok) {
          setTokenError(
            'Invalid invite link; check with the Circle Admin, there may be a new link.'
          );
          return;
        }
        const info: TokenJoinInfo = JSON.parse(await res.text());

        if (alreadyMember(info.circle.id)) {
          // shoot them off the history page
          navigate(paths.history(info.circle.id));
          return;
        }

        setTokenJoinInfo(info);
        if (info.type === CircleTokenType.Welcome) {
          setWrongAddress(true);
          return;
        }
      } catch (e) {
        setTokenError('Network error validating invite link');
      }
    };
    fn()
      .then()
      .catch(e => {
        if (e instanceof Error) {
          setTokenError(e.message ?? 'unknown error');
        } else {
          setTokenError('invalid token');
        }
      });
  }, []);

  // Waiting to validate the token
  if ((!tokenError && !tokenJoinInfo) || !profile) {
    return <LoadingModal visible={true} note="token-lookup" />;
  }

  if (address && tokenJoinInfo && wrongAddress) {
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
        <JoinWithMagicLink
          tokenJoinInfo={tokenJoinInfo}
          userName={profile.name}
        />
      )}
    </>
  );
};

export default JoinCirclePage;
