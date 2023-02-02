import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { z } from 'zod';

import type { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { LoadingModal } from '../../components';
import CircleWithLogo from '../../components/CircleWithLogo';
import { useApiBase, useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { zUsername } from '../../lib/zod/formHelpers';
import { paths } from '../../routes/paths';
import { Box, Button, CenteredBox, Panel, Text, TextField } from '../../ui';
import { normalizeError } from '../../utils/reporting';
import useConnectedAddress from 'hooks/useConnectedAddress';

export const JoinWithInviteLink = ({
  tokenJoinInfo,
  profile,
}: {
  tokenJoinInfo: TokenJoinInfo;
  profile?: { name?: string };
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const {
    circle,
    circle: { organization, users },
  } = tokenJoinInfo;

  return (
    <CenteredBox>
      {loading && <LoadingModal visible={true} />}
      <Panel nested>
        <CircleWithLogo
          logo={circle.logo}
          name={circle.name}
          orgName={organization.name}
          orgLogo={organization.logo}
          admins={users.map(u => ({
            name: u.profile.name ?? u.name,
            avatar: u.profile.avatar,
          }))}
        />
      </Panel>
      <Box css={{ textAlign: 'center', mt: '$3xl', mb: '$xl' }}>
        <Text h2 inline bold color="neutral">
          Join the {circle.name} Circle
        </Text>
      </Box>
      <Box>
        <Text
          css={{
            justifyContent: 'center',
          }}
        >
          You&apos;ve been invited to join the {circle.name} Circle at{' '}
          {organization.name}!
        </Text>
      </Box>
      {profile ? (
        <JoinForm
          tokenJoinInfo={tokenJoinInfo}
          loading={loading}
          setLoading={setLoading}
          userName={profile.name}
        />
      ) : (
        <Button
          as={NavLink}
          to={`/login?next=${location.pathname}`}
          css={{ mt: '$md' }}
          size="large"
          color="primary"
        >
          Connect Wallet
        </Button>
      )}
    </CenteredBox>
  );
};

const JoinForm = ({
  tokenJoinInfo,
  loading,
  setLoading,
  userName,
}: {
  tokenJoinInfo: TokenJoinInfo;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  userName?: string;
}) => {
  const address = useConnectedAddress();
  const { fetchManifest } = useApiBase();
  const { showError } = useToast();
  const navigate = useNavigate();

  const joinSchema = z.object({ name: zUsername });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(joinSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: { name: userName ?? '' },
  });

  useEffect(() => {
    if (userName) reset({ name: userName });
  }, [userName]);

  const { token, circle } = tokenJoinInfo;

  const submitInviteToken = async ({ name }: { name: string }) => {
    try {
      setLoading(true);
      const { createUserWithToken } = await client.mutate(
        {
          createUserWithToken: [{ payload: { token, name } }, { id: true }],
        },
        { operationName: 'createUserWithToken' }
      );
      await fetchManifest();
      if (createUserWithToken?.id) {
        navigate(paths.history(circle.id));
      }
    } catch (e) {
      const err = normalizeError(e);
      showError('Unable to finish joining: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitInviteToken)}>
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
            disabled={!!userName}
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
  );
};
