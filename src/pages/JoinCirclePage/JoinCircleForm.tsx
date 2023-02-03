import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { QUERY_KEY_NAV } from '../../features/nav';
import { useApiBase, useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';
import { Box, Button } from '../../ui';
import { normalizeError } from '../../utils/reporting';

export const JoinCircleForm = ({
  tokenJoinInfo,
  loading,
  setLoading,
}: {
  tokenJoinInfo: TokenJoinInfo;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const { fetchManifest } = useApiBase();
  const { showError } = useToast();
  const navigate = useNavigate();

  const joinSchema = z.object({});
  const queryClient = useQueryClient();

  // nb: keeping this form scaffolding for now, despite having removed username -g
  // we might add more stuff to the form and i don't want to have to rebuild it
  const {
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(joinSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const { token, circle } = tokenJoinInfo;

  const submitInviteToken = async () => {
    try {
      setLoading(true);
      const { createUserWithToken } = await client.mutate(
        {
          createUserWithToken: [{ payload: { token } }, { id: true }],
        },
        { operationName: 'createUserWithToken' }
      );
      await fetchManifest();
      if (createUserWithToken?.id) {
        navigate(paths.history(circle.id));
      }
      await queryClient.invalidateQueries(QUERY_KEY_NAV);
    } catch (e) {
      const err = normalizeError(e);
      showError('Unable to finish joining: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitInviteToken)}>
      <Box>
        <Button
          type="submit"
          color="cta"
          fullWidth
          size="large"
          disabled={loading || !isValid}
        >
          Join Circle
        </Button>
      </Box>
    </form>
  );
};
