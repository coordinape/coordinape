import { Helmet } from 'react-helmet';

import { InfiniteMembersList } from '../../../features/colinks/InifiniteMembersList';
import { order_by } from '../../../lib/anongql/__generated__/zeus';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const MostGivenPage = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Most Given / Explore / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who has given the most GIVE?</Text>
          <ExploreBreadCrumbs subsection={'Most GIVE Given'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <InfiniteMembersList
          queryKey={['MOST_GIVEN']}
          where={{}}
          orderBy={[
            {
              colinks_given_aggregate: {
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
