import { useState } from 'react';

import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button } from '../../ui';
import { LoadingModal } from 'components';
import { useFetchManifest } from 'hooks/legacyApi';

export const CreateSampleCircle = ({
  onFinish,
}: {
  onFinish(circleId: number): void;
}) => {
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);
  const fetchManifest = useFetchManifest();

  const createSampleCircle = async () => {
    try {
      setLoading(true);
      const { createSampleCircle: created } = await client.mutate(
        {
          createSampleCircle: { id: true },
        },
        {
          operationName: 'createSampleCircle',
        }
      );
      if (!created) {
        throw new Error('create sample circle failed');
      }
      await fetchManifest();
      onFinish(created.id);
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingModal visible={true} />}
      <Button
        color="secondary"
        onClick={() => createSampleCircle()}
        disabled={loading}
      >
        Try Out a Sample Circle
      </Button>
    </>
  );
};
