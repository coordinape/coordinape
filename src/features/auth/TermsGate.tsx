import { Dispatch, SetStateAction } from 'react';

import { client } from 'lib/gql/client';

import { useToast } from 'hooks';
import { EXTERNAL_URL_TOS } from 'routes/paths';
import { Button, Flex, Link, Modal, Text } from 'ui';

const TermsGate = ({
  profileId,
  setTermsAccepted,
}: {
  profileId: number;
  setTermsAccepted: Dispatch<SetStateAction<boolean>>;
}) => {
  const { showError } = useToast();

  const onSubmit = async () => {
    const currentDate = new Date();
    try {
      await client.mutate(
        {
          update_profiles_by_pk: [
            {
              pk_columns: { id: profileId },
              _set: { tos_agreed_at: currentDate.toISOString() },
            },
            { __typename: true },
          ],
        },
        { operationName: 'updateProfile__tos_agreed_at' }
      );
      setTermsAccepted(true);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
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
    </>
  );
};

export default TermsGate;
