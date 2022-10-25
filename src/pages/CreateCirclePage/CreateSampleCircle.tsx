import { useState } from 'react';

import { useApeSnackbar, useApiBase } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button } from '../../ui';
import { LoadingModal } from 'components';

export const CreateSampleCircle = ({
  onFinish,
}: {
  onFinish(circleId: number): void;
}) => {
  const { showError } = useApeSnackbar();
  const [loading, setLoading] = useState(false);
  const { fetchManifest } = useApiBase();

  const createSampleCircle = async () => {
    try {
      setLoading(true);
      const { createSampleCircle } = await client.mutate({
        createSampleCircle: { id: true },
      });
      if (!createSampleCircle) {
        throw new Error('create sample circle failed');
      }
      await fetchManifest();
      onFinish(createSampleCircle.id);
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
    // nav to the created org? or just chill
  };

  return (
    <>
      {loading && <LoadingModal visible={true} />}
      <Button
        color="primary"
        outlined
        onClick={() => createSampleCircle()}
        disabled={loading}
      >
        Try Out a Sample Circle
      </Button>
    </>
  );
};
