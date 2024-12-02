import { Helmet } from 'react-helmet';

import { InfiniteMembersList } from '../../../features/colinks/InifiniteMembersList';
import { order_by } from '../../../lib/anongql/__generated__/zeus';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const MostGivePage = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Most Give / Explore / Coordinape</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who has received the most GIVE?</Text>
          <ExploreBreadCrumbs subsection={'Most GIVE Received'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <InfiniteMembersList
          queryKey={['MOST_GIVE']}
          where={{}}
          orderBy={[
            {
              colinks_gives_aggregate: {
                count: order_by.desc_nulls_last,
              },
              name: order_by.desc,
            },
          ]}
          includeRank={true}
        />
      </Flex>
    </SingleColumnLayout>
  );
};
