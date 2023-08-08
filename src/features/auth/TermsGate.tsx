import { useState } from 'react';

import { useToast } from 'hooks';
import { EXTERNAL_URL_TOS } from 'routes/paths';
import { Button, Flex, Link, Modal, Text } from 'ui';

const TermsGate = () => {
  const [acceptDate, setAcceptDate] = useState<Date | null>(null);
  const [accepted, setAccepted] = useState<boolean>(false);
  const { showError } = useToast();

  const onSubmit = async () => {
    const currentDate = new Date();
    setAcceptDate(currentDate);
    setAccepted(true);
    try {
      // eslint-disable-next-line no-console
      console.log('try');
      // await save(newMembers);
    } catch (error) {
      showError(error);
      // eslint-disable-next-line no-console
      console.log('catch');
    } finally {
      // eslint-disable-next-line no-console
      console.log('finally');
    }
  };

  return (
    <>
      {!accepted ? (
        <Modal
          title="Coordinape Terms of Service"
          open={true}
          showClose={false}
        >
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
      ) : (
        <Text tag color="primary">
          Terms of Service accepted on: {acceptDate?.toLocaleString()}
        </Text>
      )}
    </>
  );
};

export default TermsGate;
