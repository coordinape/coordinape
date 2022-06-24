/* eslint-disable */

import React, { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import { Box } from '../../ui/Box/Box';
import { Button } from '../../ui/Button/Button';

import { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { LoadingModal } from '../../components';
import { useMyProfile } from '../../recoilState';
import { TextField } from '../../ui';
import { client } from '../../lib/gql/client';
import { useApeSnackbar } from '../../hooks';
import { normalizeError } from '../../utils/reporting';
import { CircleTokenType } from '../../common-lib/circleShareTokens';
import { useNavigate } from 'react-router';
import { paths } from '../../routes/paths';

export const JoinCirclePage = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const { myUsers } = useMyProfile();
  const { showInfo, showError } = useApeSnackbar();

  const [name, setName] = useState<string>('');

  const [tokenError, setTokenError] = useState<string | undefined>();
  const [tokenJoinInfo, setTokenJoinInfo] = useState<
    TokenJoinInfo | undefined
  >();

  const alreadyMember = (circleId: number) => {
    let found = false;
    for (let user of myUsers) {
      if (user.circle_id === circleId) {
        found = true;
        break;
      }
    }
    return found;
  };

  useEffect(() => {
    const fn = async () => {
      // const tokenReq =
      try {
        const res = await fetch('/api/circle/landing/' + token);
        if (!res.ok) {
          setTokenError('invalid invite link');
          return;
        }
        const info: TokenJoinInfo = JSON.parse(await res.text());

        if (info.type === CircleTokenType.Welcome) {
          // they should already be a member with this address, lets find out?

          if (!alreadyMember(info.circle.id)) {
            setTokenError(
              'This address has not been invited to the circle. Try contacting the admins \
                or connecting with a different address.'
            );
            return;
          }
        }
        setTokenJoinInfo(info);
      } catch (e) {
        setTokenError('Network error validating invite link');
      }
    };
    fn()
      .then()
      .catch(e => {
        if (e instanceof Error) {
          setTokenError(e.message ?? 'no luck mate');
        } else {
          setTokenError('invalid token');
        }
      });
  });

  const submitMagicToken = async () => {
    if (!token) {
      showError('empty token');
      return;
    }
    try {
      const { createUserWithToken } = await client.mutate({
        createUserWithToken: [
          {
            payload: {
              token,
              name,
            },
          },
          {
            id: true,
          },
        ],
      });
      if (createUserWithToken?.id) {
        showInfo('ok joined!!!');
        navigate(paths.circles);
      }
    } catch (e) {
      // TODO: normalize error
      const err = normalizeError(e);
      showError('Unable to finish joining: ' + err.message);
    }
  };

  if (!tokenError && !tokenJoinInfo) {
    return <LoadingModal visible={true} />;
  }
  return (
    <>
      {tokenError && <Box>Error! {tokenError}</Box>}
      {tokenJoinInfo && (
        <>
          <Box>Join {tokenJoinInfo.circle.name}</Box>
          <Box>
            In the {tokenJoinInfo.circle.organization.name} organization.
          </Box>
          <Box>
            {tokenJoinInfo.type === CircleTokenType.Magic &&
            !alreadyMember(tokenJoinInfo.circle.id) ? (
              <Box>
                // TODO: handle already being member
                <Box>You are invited to join this circle.</Box>
                <TextField
                  placeholder={'Enter name'}
                  value={name}
                  onChange={evt => setName(evt.target.value)}
                />
                <Button onClick={submitMagicToken}>Submit</Button>
              </Box>
            ) : (
              <Box>
                You are now a member of the circle. Get started here:
                <Button>
                  <Link to={paths.circles}>{tokenJoinInfo.circle.name}</Link>
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default JoinCirclePage;
