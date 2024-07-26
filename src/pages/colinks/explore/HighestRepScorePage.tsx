import { Helmet } from 'react-helmet';

import { InfiniteMembersList } from '../../../features/colinks/InifiniteMembersList';
import { order_by } from '../../../lib/anongql/__generated__/zeus';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const HighestRepScorePage = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Highest Rep Score / Explore / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who has the highest Rep Score?</Text>
          <ExploreBreadCrumbs subsection={'Highest Rep Score'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <InfiniteMembersList
          queryKey={['HIGHEST_REP_SCORE']}
          where={{}}
          orderBy={[
            {
              reputation_score: { total_score: order_by.desc },
              name: order_by.desc,
            },
          ]}
          includeRank={true}
        />
      </Flex>
    </SingleColumnLayout>
  );
};
