import React from 'react';

import HintBanner from '../../components/HintBanner';
import {
  EXTERNAL_URL_DOCS_CONTRIBUTIONS,
  EXTERNAL_URL_DOCS_INTEGRATIONS,
} from 'routes/paths';
import { Flex, Button, Text } from 'ui';

export const ContributionIntro = () => {
  return (
    <HintBanner title={'Share Your Work'}>
      <Text p as="p">
        Share your contributions with your collaborators as you perform them.
        Use your contribution journal at the end of the Epoch to help you write
        your Epoch Statement. Contributions can also be automatically populated
        from other sites such as Dework and Wonder.
      </Text>
      <Flex css={{ gap: '$md' }}>
        <Button
          as="a"
          href={EXTERNAL_URL_DOCS_CONTRIBUTIONS}
          target="_blank"
          rel="noreferrer"
          color="secondary"
        >
          Contributions Docs
        </Button>
        <Button
          as="a"
          href={EXTERNAL_URL_DOCS_INTEGRATIONS}
          target="_blank"
          rel="noreferrer"
          color="secondary"
        >
          Integrations Docs
        </Button>
      </Flex>
    </HintBanner>
  );
};
