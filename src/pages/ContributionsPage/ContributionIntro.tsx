import React from 'react';

import HintBanner from '../../components/HintBanner';
import { Flex, Button, Text } from 'ui';

export const ContributionIntro = () => {
  return (
    <HintBanner title={'Share Your Work'}>
      <Text p as="p" css={{ mb: '$md' }}>
        Share your contributions with your collaborators as you perform them.
        Use your contribution journal at the end of the Epoch to help you write
        your Epoch Statement. Contributions can also be automatically populated
        from other sites such as Dework and Wonder.
      </Text>
      <Flex>
        <Button
          as="a"
          href={
            'https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/record-contributions#contributions'
          }
          target="_blank"
          rel="noreferrer"
          color="primary"
          outlined
          css={{ mt: '$md', mr: '$md' }}
        >
          Contributions Docs
        </Button>
        <Button
          as="a"
          href={'https://docs.coordinape.com/info/integrations'}
          target="_blank"
          rel="noreferrer"
          color="primary"
          outlined
          css={{ mt: '$md', mr: '$md' }}
        >
          Integrations Docs
        </Button>
      </Flex>
    </HintBanner>
  );
};
