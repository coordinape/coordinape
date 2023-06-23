/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';

import { ContractReceipt } from '@ethersproject/contracts';
import { pulseStyles } from 'features/nav/SideNav';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Check, ExternalLink } from '../../icons/__generated';
import { Button, Flex, Link, Modal, Text } from 'ui';
import { makeExplorerUrl } from 'utils/provider';

import { chain } from './chains';
import { coSoulCloud } from './CoSoulArtContainer';

export const MINTING_STEPS = [
  'Build a Reputation on Coordinape',
  'Connect to Optimism',
  'Approve Transaction',
  // 'Reticulate Splines',
  'Minting your CoSoul',
  'Etching your pGIVE on the Blockchain',
  // 'Commission the Artist',
] as const;

export type MintingStep = typeof MINTING_STEPS[number];

const isDone = (step: MintingStep, currentStep: MintingStep) => {
  return MINTING_STEPS.indexOf(step) <= MINTING_STEPS.indexOf(currentStep);
};

export const MintingModal = ({
  onReveal,
  currentStep,
  receipt,
  txHash,
}: {
  onReveal: () => void;
  currentStep: MintingStep;
  txHash: string | null;
  receipt: ContractReceipt | null;
}) => {
  const chainId = Number(chain.chainId);
  return (
    <Modal
      loader
      forceTheme="dark"
      open={true}
      showClose={false}
      css={{
        position: 'relative',
        top: '-$lg ',
        overflow: 'hidden',
        '&:before': {
          content: '',
          ...coSoulCloud,
          zIndex: '1 !important',
          top: 'calc(50% - 250px) !important',
        },
        '&:after': {
          content: '',
          background:
            'radial-gradient(circle, rgba(0,0,0,1) 25%, rgba(226,226,226,0) 100%)',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          zIndex: '0 !important',
        },
      }}
    >
      <Flex
        column
        css={{
          gap: '$xs',
          position: 'relative',
          zIndex: '2',
          mt: '$lg',
        }}
      >
        {receipt && (
          <Flex
            css={{
              alignItems: 'center',
              gap: '$xs',
            }}
          ></Flex>
        )}
        {MINTING_STEPS.map(step => (
          <MintingStepRow
            key={step}
            step={step}
            done={isDone(step, currentStep)}
            txHash={txHash}
            receipt={receipt}
            activeStep={
              MINTING_STEPS.indexOf(step) ===
              MINTING_STEPS.indexOf(currentStep) + 1
            }
          />
        ))}

        <Flex
          css={{
            mt: '$2xl',
            justifyContent: 'center',
          }}
        >
          {MINTING_STEPS.indexOf(currentStep) > 1 ? (
            <Text
              size="small"
              color="cta"
              css={{
                zIndex: 3,
                position: 'relative',
                borderRadius: '$3',
                width: '100%',
              }}
            >
              {!receipt && txHash && (
                <Flex
                  css={{
                    zIndex: 4,
                  }}
                >
                  Transaction Hash: {displayTxHash(txHash)}
                </Flex>
              )}
              {receipt && (
                <>
                  <Link
                    inlineLink
                    target="_blank"
                    href={makeExplorerUrl(
                      chainId,
                      receipt.transactionHash,
                      'tx'
                    )}
                  >
                    <Text>
                      Transaction confirmed in block: {receipt.blockNumber}
                    </Text>
                  </Link>
                </>
              )}
            </Text>
          ) : (
            <Text
              size="small"
              css={{
                zIndex: 3,
                position: 'relative',
                borderRadius: '$3',
                width: '100%',
                visibility: 'hidden',
              }}
            >
              Status
            </Text>
          )}
        </Flex>
        <Flex
          css={{
            mt: '$2xl',
            justifyContent: 'center',
          }}
        >
          {MINTING_STEPS.indexOf(currentStep) === MINTING_STEPS.length - 1 ? (
            <Button
              size="large"
              color="cta"
              onClick={onReveal}
              css={{
                zIndex: 3,
                position: 'relative',
                borderRadius: '$3',
                width: '100%',
                '&:before': {
                  ...pulseStyles,
                  borderRadius: '$3',
                },
                '&:after': {
                  ...pulseStyles,
                  borderRadius: '$3',
                  animationDelay: '1.5s',
                  zIndex: -1,
                },
              }}
            >
              Reveal Your CoSoul
            </Button>
          ) : (
            <Button
              size="large"
              css={{
                zIndex: 3,
                position: 'relative',
                borderRadius: '$3',
                width: '100%',
                visibility: 'hidden',
              }}
            >
              Reveal Your CoSoul
            </Button>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
};

const MintingStepRow = ({
  step,
  done,
  activeStep,
  receipt,
  txHash,
}: {
  step: MintingStep;
  done: boolean;
  activeStep: boolean;
  receipt: ContractReceipt | null;
  txHash: string | null;
}) => {
  return (
    <Flex column>
      <Flex alignItems="center" css={{ width: '22rem', margin: 'auto' }}>
        <Flex css={{ width: 48, justifyContent: 'right', mr: '$md' }}>
          {done ? (
            <Check color="cta" />
          ) : (
            activeStep && (
              <LoadingIndicator size={24} css={{ margin: 'auto' }} />
            )
          )}
        </Flex>
        <Flex
          css={{
            padding: '$md $md $md $3xl',
            ml: '-$3xl',
            width: '100%',
            borderRadius: '$1',
            ...(activeStep
              ? {
                  background: 'rgba(0,0,0,0.6)',
                  color: '$cta ',
                }
              : {}),
          }}
        >
          <Flex column>
            <Flex>{step}</Flex>
          </Flex>
        </Flex>
      </Flex>
      {MINTING_STEPS.indexOf(step) === MINTING_STEPS.length - 1 && receipt && (
        <Flex
          css={{
            ml: 48,
            pl: '$md',
            width: '100%',
          }}
        >
          <Link
            inlineLink
            target="_blank"
            href={makeExplorerUrl(10, receipt.transactionHash, 'tx')}
          >
            <Text
              css={{
                mt: '$xs',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ExternalLink css={{ mr: '$sm' }} />
              confirmed in block: {receipt.blockNumber}
            </Text>
          </Link>
        </Flex>
      )}
    </Flex>
  );
};

const displayTxHash = (hash: string) => {
  return hash.length <= 34 ? hash : `${hash.slice(0, 10)}...${hash.slice(-24)}`;
};
