import { formatRelative } from 'date-fns';
import { FiExternalLink } from 'react-icons/fi';

import { Box, Flex, Link, Modal, Text } from 'ui';

const TX_LIST_KEY = 'capeRecentTxs';

type Tx = {
  timestamp: number; // Date.now() format
  description: string;
  hash?: string;
  status: 'pending' | 'confirmed' | 'error';
  chainId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const placeholder = (status: Tx['status']): Tx => ({
  description: 'Placeholder',
  hash: '0xa0c653d17fee8bdd04b287706d995eabd8a3f73adca0abf344bcd14160457e0d',
  timestamp: 1655773321749,
  status,
  chainId: '1338',
});

const getTxList = (): Tx[] =>
  JSON.parse(localStorage.getItem(TX_LIST_KEY) || '[]').slice(0, 10);

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

const statusColors = {
  pending: '$secondaryText',
  confirmed: '$complete',
  error: '$alert',
};

const etherscanLinkProp = (chainId: string | undefined, hash: string) => {
  if (chainId === '1') return { href: `https://etherscan.io/tx/${hash}` };
  if (chainId === '5')
    return { href: `https://goerli.etherscan.io/tx/${hash}` };

  return {
    onClick: () => alert(hash),
  };
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
        {list.map(
          ({ chainId, description, hash, timestamp, status }, index) => (
            <Box
              key={timestamp}
              css={{
                display: 'grid',
                gridTemplateColumns: '1fr 40px',
                padding: '$sm',
                backgroundColor: index % 2 == 0 ? '$background' : 'transparent',
              }}
            >
              <Box>
                {description}
                <Text size="small" css={{ color: '$secondaryText', mt: '$xs' }}>
                  {formatRelative(new Date(timestamp), Date.now())}
                  <Box css={{ mx: '$xs' }}>&bull;</Box>
                  {chainId === '1'
                    ? 'Mainnet'
                    : chainId === '5'
                    ? 'Göerli'
                    : `Chain ID ${chainId}`}
                  <Box css={{ mx: '$xs' }}>&bull;</Box>
                  <Text css={{ color: statusColors[status] }}>{status}</Text>
                </Text>
              </Box>
              <Box css={{ textAlign: 'right', pt: '$xs' }}>
                {hash && (
                  <Link target="_blank" {...etherscanLinkProp(chainId, hash)}>
                    <FiExternalLink />
                  </Link>
                )}
              </Box>
            </Box>
          )
        )}
      </Flex>
    </Modal>
  );
};
