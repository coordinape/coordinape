import { Helmet } from 'react-helmet';

import { InfiniteMembersList } from '../../../features/colinks/InifiniteMembersList';
import { order_by } from '../../../lib/anongql/__generated__/zeus';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const MostLinksPage = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Most Links / Explore / Coordinape</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who have people bought the most links to?</Text>
          <ExploreBreadCrumbs subsection={'Most Links'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <InfiniteMembersList
          queryKey={['MOST_LINKS']}
          where={{}}
          orderBy={[{ links: order_by.desc, name: order_by.desc }]}
          includeRank={true}
        />
      </Flex>
    </SingleColumnLayout>
  );
};
