import assert from 'assert';
import { useEffect, useState } from 'react';

import { QUERY_KEY_NAV, useNavQuery } from 'features/nav/getNavData';
import { client } from 'lib/gql/client';
import { useMutation, useQueryClient } from 'react-query';

import { useToast } from 'hooks';
import { EXTERNAL_URL_TOS } from 'routes/paths';
import { Button, Flex, Link, Modal, Text } from 'ui';

const TermsGate = ({ children }: { children: React.ReactNode }) => {
  const { data } = useNavQuery();
  const profileId = data?.profile?.id;
  const { showError } = useToast();
  const queryClient = useQueryClient();
  const [termsAccepted, setTermsAccepted] = useState(false);
  useEffect(() => {
    setTermsAccepted(!!data?.profile.tos_agreed_at);
  }, [data?.profile?.tos_agreed_at]);

  const acceptTos = async (profileId: number) => {
    const { acceptTOS } = await client.mutate(
      { acceptTOS: { tos_agreed_at: true } },
      { operationName: 'acceptTOS__termsGate' }
    );

    assert(acceptTOS);

    return { tos_agreed_at: acceptTOS.tos_agreed_at, profile_id: profileId };
  };

  // TODO: perhaps use a handler for better validation
  const acceptTosMutation = useMutation(acceptTos, {
    onSuccess: res => {
      if (res) {
        setTermsAccepted(true);

        queryClient.setQueryData<typeof data>(
          [QUERY_KEY_NAV, profileId],
          oldData => {
            if (oldData) {
              const tos_agreed_at = res.tos_agreed_at;
              const profile = { ...oldData.profile, tos_agreed_at };

              return { ...oldData, profile };
            }
          }
        );
      }
    },
    onError: error => {
      showError(error);
    },
  });

  const onSubmit = async () => {
    await acceptTosMutation.mutate(profileId);
  };

  if (profileId && !termsAccepted) {
    return (
      <Modal title="Coordinape Terms of Service" open={true} showClose={false}>
        <Flex column css={{ gap: '$md' }}>
          <Text p as="p">
            To use Coordinape Vaults and Claims you must accept our{' '}
            <Link
              inlineLink
              href={EXTERNAL_URL_TOS}
              css={{ textDecoration: 'underline' }}
            >
              terms of service
            </Link>
          </Text>
          <Button onClick={onSubmit}>Accept Terms of Service</Button>
        </Flex>
      </Modal>
    );
  }

  return <>{children}</>;
};

export default TermsGate;
