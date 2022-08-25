import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { CircleTokenType } from '../../common-lib/circleShareTokens';
import { LoadingModal } from '../../components';
import { useMyProfile } from '../../recoilState';
import { paths } from '../../routes/paths';
import { Panel, Text } from '../../ui';
import CenteredBox from '../../ui/CenteredBox';

import { AddressIsNotMember } from './AddressIsNotMember';
import { JoinWithMagicLink } from './JoinWithMagicLink';

export const JoinCirclePage = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const { myUsers } = useMyProfile();

  const [tokenError, setTokenError] = useState<string | undefined>();
  const [wrongAddress, setWrongAddress] = useState<boolean | undefined>(
    undefined
  );
  const [tokenJoinInfo, setTokenJoinInfo] = useState<
    TokenJoinInfo | undefined
  >();

  const alreadyMember = (circleId: number) =>
    myUsers.some(u => u.circle_id === circleId);

  useEffect(() => {
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
  if (!tokenError && !tokenJoinInfo) {
    return <LoadingModal visible={true} />;
  }

  if (tokenJoinInfo && wrongAddress) {
    return <AddressIsNotMember tokenJoinInfo={tokenJoinInfo} />;
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
      {tokenJoinInfo && <JoinWithMagicLink tokenJoinInfo={tokenJoinInfo} />}
    </>
  );
};

export default JoinCirclePage;
