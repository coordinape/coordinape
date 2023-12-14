import assert from 'assert';
import { Dispatch, useEffect, useState } from 'react';

import { useAuthStore } from 'features/auth';
import { client } from 'lib/gql/client';
import { useMutation, useQueryClient } from 'react-query';

import {
  QUERY_KEY_COLINKS_NAV,
  useCoLinksNavQuery,
} from '../useCoLinksNavQuery';
import { useToast } from 'hooks';
import { EXTERNAL_URL_TOS } from 'routes/paths';
import { Button, CheckBox, Flex, Link, Text } from 'ui';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const TOS_UPDATED_AT = '2023-11-30';

export const WizardTerms = ({
  setTermsAccepted,
}: {
  setTermsAccepted: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { showError } = useToast();
  const { data } = useCoLinksNavQuery();
  const queryClient = useQueryClient();
  const profileId = useAuthStore(state => state.profileId);

  const [termsAcceptChecked, setTermsAcceptChecked] = useState(false);

  useEffect(() => {
    // require TOS agreement since TOS_UPDATED_AT
    if (data?.profile?.tos_agreed_at) {
      const tosAgreedAt = new Date(data.profile.tos_agreed_at);
      const tosUpdatedAt = new Date(TOS_UPDATED_AT);
      if (tosAgreedAt > tosUpdatedAt) {
        setTermsAccepted(true);
      }
    }
  }, [data?.profile?.tos_agreed_at]);

  const acceptTos = async (profileId: number) => {
    const { acceptTOS } = await client.mutate(
      { acceptTOS: { tos_agreed_at: true } },
      { operationName: 'acceptTOS__termsGate' }
    );

    assert(acceptTOS);

    return { tos_agreed_at: acceptTOS.tos_agreed_at, profile_id: profileId };
  };

  const acceptTosMutation = useMutation(acceptTos, {
    onSuccess: res => {
      if (res) {
        setTermsAccepted(true);

        queryClient.setQueryData<typeof data>(
          [QUERY_KEY_COLINKS_NAV, profileId],
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
  const onAcceptTermsSubmit = async () => {
    assert(profileId);
    await acceptTosMutation.mutate(profileId);
  };

  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, rgb(18 19 21) 0%, #E5AF52 58%, #815114 83%, #8DA9AF 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-tos.jpg')",
          backgroundPosition: 'bottom',
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$lg' }}>
          <Text h2>Terms of Service</Text>
          <Text p as="p">
            CoLinks is owned and controlled by The Coordinape Foundation.
          </Text>
          <Text p as="p">
            To use CoLinks you must accept our{' '}
            <Link
              inlineLink
              href={EXTERNAL_URL_TOS}
              target="_blank"
              css={{ textDecoration: 'underline', whiteSpace: 'nowrap' }}
            >
              terms of service
            </Link>
          </Text>
          <CheckBox
            value={termsAcceptChecked}
            label={'I have read and accept the Terms of Service'}
            onChange={() => setTermsAcceptChecked(prev => !prev)}
          />

          <Button
            size="large"
            color="cta"
            onClick={onAcceptTermsSubmit}
            disabled={!termsAcceptChecked}
          >
            Accept Terms of Service
          </Button>
        </Flex>
      </WizardInstructions>
    </>
  );
};
