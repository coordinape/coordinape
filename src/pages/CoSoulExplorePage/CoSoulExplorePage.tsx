import { ChangeEvent, useCallback, useState } from 'react';

import { Where } from 'features/activities/useInfiniteActivities';
import { client } from 'lib/gql/client';
import debounce from 'lodash/debounce';

import { Box, Flex, Select, Text, TextField } from '../../ui';
import { isFeatureEnabled } from 'config/features';

import { CoSoulItemList } from './CoSoulItemList';
import { getOrderBy, Order, orderOptions } from './Order';

const CoSoulExplorePage = () => {
  const [orderBy, setOrderBy] = useState<Order>(orderOptions[0]);
  const [where, setWhere] = useState<Where | null>(null);
  const [nameQueryField, setNameQueryField] = useState('');
  const [relevanceQueryField, setRelevanceQueryField] = useState('');

  const keywordHandleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameQueryField(e.target.value);
    updateNameWhere(e.target.value);
  };

  const vectorHandleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRelevanceQueryField(e.target.value);
    updateIdWhere(e.target.value);
  };

  const updateIdWhere = useCallback(
    debounce((q: string) => {
      getVectorAndUpdateWhere(q);
    }, 1000),
    []
  );

  const getVectorAndUpdateWhere = async (q: string) => {
    // if empty query, reset where
    if (q.trim() === '') {
      setWhere(prev => ({
        ...prev,
        id: undefined,
      }));
      return;
    }

    const { searchCosouls } = await client.query(
      {
        searchCosouls: [
          {
            payload: { search_query: q },
          },
          {
            cosoul_ids: true,
          },
        ],
      },
      {
        operationName: 'searchCoSoulsFE',
      }
    );

    const ids = searchCosouls?.cosoul_ids;

    setWhere(prev => ({
      ...prev,
      id: { _in: ids },
    }));
  };

  const updateNameWhere = useCallback(
    debounce((q: string) => {
      setWhere(prev => ({
        ...prev,
        profile_public: {
          name: { _ilike: `%${q}%` },
        },
      }));
    }, 1000),
    []
  );

  return (
    <Box>
      <Flex css={{ gap: '$xl', ml: '$xl' }}>
        <Text h1>Explore CoSouls</Text>
        <Flex css={{ m: '$lg', gap: '$lg' }}>
          <TextField
            value={nameQueryField}
            onChange={keywordHandleQueryChange}
            placeholder={'Search by name'}
          />

          {isFeatureEnabled('vector_search') && (
            <TextField
              value={relevanceQueryField}
              onChange={vectorHandleQueryChange}
              placeholder={'Vector model search'}
            />
          )}

          <Select
            css={{ flexGrow: 0 }}
            value={orderBy.value}
            options={orderOptions}
            onValueChange={value => setOrderBy(getOrderBy(value))}
          />
        </Flex>
      </Flex>
      <CoSoulItemList where={where} orderBy={orderBy.orderBy} />
    </Box>
  );
};

export default CoSoulExplorePage;
