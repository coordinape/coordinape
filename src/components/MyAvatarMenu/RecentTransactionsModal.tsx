import { formatRelative } from 'date-fns';
import { FiExternalLink } from 'react-icons/fi';

import { Box, Flex, Link, Modal, Text } from 'ui';

const TX_LIST_KEY = 'capeRecentTxs';

type Tx = {
  timestamp: number; // Date.now() format
  description: string;
  hash?: string;
  status: 'pending' | 'confirmed' | 'error';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const placeholder = (status: Tx['status']): Tx => ({
  description: 'Placeholder',
  hash: '0xa0c653d17fee8bdd04b287706d995eabd8a3f73adca0abf344bcd14160457e0d',
  timestamp: 1655773321749,
  status,
});

const getTxList = (): Tx[] =>
  JSON.parse(localStorage.getItem(TX_LIST_KEY) || '[]').slice(-10);

const saveTxList = (list: Tx[]) =>
  localStorage.setItem(TX_LIST_KEY, JSON.stringify(list));

export const addTransaction = (tx: Tx) => saveTxList([tx, ...getTxList()]);

export const updateTransaction = (timestamp: number, updates: Partial<Tx>) => {
  const list = getTxList();
  const index = list.findIndex(tx => tx.timestamp === timestamp);
  if (index === -1) return;
  list.splice(index, 1, { ...list[index], ...updates });
  saveTxList(list);
};

export const RecentTransactionsModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const list = getTxList();
  return (
    <Modal onClose={onClose}>
      <Text h3 css={{ mb: '$lg' }}>
        Your Recent Transactions
      </Text>
      <Flex css={{ flexDirection: 'column' }}>
        {list.length === 0 && <>Your transactions will appear here.</>}
        {list.map(({ description, hash, timestamp, status }, index) => (
          <Box
            key={timestamp}
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 40px',
              padding: '$sm',
              backgroundColor: index % 2 == 0 ? '$background' : 'transparent',
            }}
          >
            <Box>
              {description}
              <Text size="small" css={{ color: '$secondaryText', mt: '$xs' }}>
                {formatRelative(new Date(timestamp), Date.now())} &bull;{' '}
                {status}
              </Text>
            </Box>
            <Box></Box>
            <Box css={{ textAlign: 'right', pt: '$xs' }}>
              {hash && (
                <Link target="_blank" href={`https://etherscan.io/tx/${hash}`}>
                  <FiExternalLink />
                </Link>
              )}
            </Box>
          </Box>
        ))}
      </Flex>
    </Modal>
  );
};
