import { ChainId } from '@decent.xyz/box-common';

import { Button, Text, Modal, Flex } from 'ui';

import { defaultAvailableChains } from './config';
import { chainInfo } from './constants';

export const ChainSelectorModal = ({
  chainId,
  onSelectChain,
  onClose,
}: {
  chainId: ChainId;
  onSelectChain: (chainId: ChainId) => void;
  onClose: () => void;
}) => {
  return (
    <Modal onOpenChange={() => onClose()} css={{ width: '300px' }}>
      <Flex column css={{ gap: '$sm' }}>
        <Text
          variant="label"
          css={{ textAlign: 'center', width: '100%', display: 'block' }}
        >
          Choose a Chain to Send From
        </Text>
        {defaultAvailableChains.map(c => {
          const Icon = chainInfo[c].icon;
          return (
            <Button
              css={{
                width: '100%',
                textAlign: 'left',
                outlineColor: '$borderDim',
                cursor: chainId === c ? 'default' : 'pointer',
                justifyContent: 'space-between',
              }}
              color={chainId === c ? 'primary' : 'secondary'}
              key={c}
              onClick={() => {
                onSelectChain(c);
                onClose();
              }}
            >
              <Text css={{ whiteSpace: 'pre' }}>{chainInfo[c].name} </Text>
              {c === 1 || c === 11155111 ? (
                <Icon nostroke size="md" />
              ) : (
                <Icon nostroke size="md" fa />
              )}
            </Button>
          );
        })}
      </Flex>
    </Modal>
  );
};
