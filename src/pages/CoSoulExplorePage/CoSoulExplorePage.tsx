import { ChangeEvent, useCallback, useState } from 'react';

import debounce from 'lodash/debounce';

import { Box, Flex, Select, Text, TextField } from '../../ui';

import { CoSoulItemList } from './CoSoulItemList';
import { getOrderBy, Order, orderOptions } from './Order';
import { Where } from './useInfiniteCoSouls';

const CoSoulExplorePage = () => {
  const [orderBy, setOrderBy] = useState<Order>(orderOptions[0]);
  const [where, setWhere] = useState<Where | null>(null);
  const [queryField, setQueryField] = useState('');

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryField(e.target.value);
    updateWhere(e.target.value);
  };

  const updateWhere = useCallback(
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
            value={queryField}
            onChange={handleQueryChange}
            placeholder={'Search by name'}
          />

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
