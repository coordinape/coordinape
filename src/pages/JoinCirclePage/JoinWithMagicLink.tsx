import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { LoadingModal } from '../../components';
import CircleWithLogo from '../../components/CircleWithLogo';
import { zUsername } from '../../forms/formHelpers';
import { useApeSnackbar, useApiBase } from '../../hooks';
import { client } from '../../lib/gql/client';
import { useMyProfile } from '../../recoilState';
import { paths } from '../../routes/paths';
import { Box, Button, TextField, Text, Panel } from '../../ui';
import { normalizeError } from '../../utils/reporting';

import CenteredBox from './CenteredBox';

export const JoinWithMagicLink = ({
  tokenJoinInfo,
}: {
  tokenJoinInfo: TokenJoinInfo;
}) => {
  const { fetchManifest } = useApiBase();
  const { showError } = useApeSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { address } = useMyProfile();

  const joinSchema = z.object({ name: zUsername });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(joinSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const submitMagicToken = async ({ name }: { name: string }) => {
    try {
      setLoading(true);
      const { createUserWithToken } = await client.mutate({
        createUserWithToken: [
          {
            payload: {
              token: tokenJoinInfo.token,
              name: name,
            },
          },
          {
            id: true,
          },
        ],
      });
      await fetchManifest();
      if (createUserWithToken?.id) {
        navigate(paths.history(tokenJoinInfo.circle.id));
      }
    } catch (e) {
      const err = normalizeError(e);
      showError('Unable to finish joining: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredBox>
      {loading && <LoadingModal visible={true} />}
      <Panel nested>
        <CircleWithLogo
          logo={tokenJoinInfo.circle.logo}
          name={tokenJoinInfo.circle.name}
          orgName={tokenJoinInfo.circle.organization.name}
          orgLogo={tokenJoinInfo.circle.organization.logo}
          admins={tokenJoinInfo.circle.users.map(u => ({
            name: u.name,
            avatar: u.profile.avatar,
          }))}
        />
      </Panel>
      <Box css={{ textAlign: 'center', mt: '$3xl', mb: '$xl' }}>
        <Text h2 inline bold color="neutral">
          Join the {tokenJoinInfo.circle.name} Circle
        </Text>
      </Box>
      <Box>
        <Text
          css={{
            justifyContent: 'center',
          }}
        >
          You&apos;ve been invited to join the {tokenJoinInfo.circle.name}{' '}
          Circle at {tokenJoinInfo.circle.organization.name}!
        </Text>
      </Box>

      <form onSubmit={handleSubmit(submitMagicToken)}>
        <Box
          css={{
            mb: '$md',
            mt: '$3xl',
            alignItems: 'center',
            display: 'grid',
            gridColumnGap: '$md',
            gridTemplateColumns: '35fr 65fr',
          }}
        >
          <Box>
            <Box css={{ mb: '$xs' }}>
              <Text variant="label">Name</Text>
            </Box>
            <TextField
              inPanel
              placeholder="Name"
              fullWidth
              autoComplete="off"
              error={errors.name !== undefined}
              {...register(`name`)}
            />
          </Box>
          <Box>
            <Box css={{ mb: '$xs' }}>
              <Text variant="label">Wallet Address</Text>
            </Box>
            <TextField
              inPanel
              placeholder="Address"
              fullWidth
              disabled={true}
              value={address}
            />
          </Box>
          <Box>
            {errors.name && (
              <Text variant="formError" css={{ mt: '$sm', textAlign: 'left' }}>
                {errors.name.message}
              </Text>
            )}
          </Box>
        </Box>
        <Box>
          <Button
            type="submit"
            color="primary"
            fullWidth
            size="large"
            disabled={loading || !isValid}
          >
            Join
          </Button>
        </Box>
      </form>
    </CenteredBox>
  );
};
