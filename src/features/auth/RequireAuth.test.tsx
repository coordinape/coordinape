import { render, screen, act, waitFor } from '@testing-library/react';
import { saveAllData, EConnectorNames } from 'features/auth/useSavedAuth';
import { useQueryClient } from 'react-query';

import {
  generateTokenString,
  hashTokenString,
} from '../../../api-lib/authHelpers';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { createProfile } from '../../../api-test/helpers';
import { useWeb3React } from 'hooks/useWeb3React';
import { provider as getProvider, TestWrapper } from 'utils/testing';

import { RequireAuth } from './RequireAuth';
import { QUERY_KEY_LOGIN_DATA } from './useLoginData';

import { Awaited } from 'types/shim';

let profile: Awaited<ReturnType<typeof createProfile>>, token: string;

beforeAll(async () => {
  const tokenString = generateTokenString();
  profile = await createProfile(adminClient);
  const { insert_personal_access_tokens_one } = await adminClient.mutate(
    {
      delete_personal_access_tokens: [
        { where: { profile: { id: { _eq: profile.id } } } },
        { affected_rows: true },
      ],
      insert_personal_access_tokens_one: [
        {
          object: {
            name: 'circle-access-token',
            abilities: '["read"]',
            tokenable_type: 'App\\Models\\Profile',
            tokenable_id: profile.id,
            token: hashTokenString(tokenString),
          },
        },
        { id: true },
      ],
    },
    { operationName: 'test' }
  );
  token = `${insert_personal_access_tokens_one?.id}|${tokenString}`;
});

test('show connection modal', () => {
  render(
    <TestWrapper>
      <RequireAuth>
        <div>Hello world</div>
      </RequireAuth>
    </TestWrapper>
  );
  screen.findByText('Connect Your Wallet');
});

test('reconnect with saved auth', async () => {
  const provider = getProvider();
  const address = await provider.getSigner().getAddress();

  saveAllData({
    recent: address.toLocaleLowerCase(),
    data: {
      [address.toLowerCase()]: {
        connectorName: EConnectorNames.Injected,
        token,
        id: profile.id,
      },
    },
  });

  const WaitForAddress = (props: { children: any }) =>
    useWeb3React().active ? props.children : <>nope</>;

  let data: any;

  const CheckData = () => {
    const queryClient = useQueryClient();
    data = queryClient.getQueryData(QUERY_KEY_LOGIN_DATA);
    return null;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <WaitForAddress>
          <RequireAuth>
            <CheckData />
          </RequireAuth>
        </WaitForAddress>
      </TestWrapper>
    );
  });

  await waitFor(() => {
    expect(data.id).toBe(profile.id);
    expect(data.name).toBe(profile.name);
  });
});
