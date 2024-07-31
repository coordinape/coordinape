/* eslint-disable no-console */
import assert from 'assert';
import { ComponentProps, useContext } from 'react';

import { CoLinks } from '@coordinape/contracts/typechain';
import { useQueryClient } from 'react-query';

import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';
import useConnectedAddress from 'hooks/useConnectedAddress';

import { CoLinksContext } from './CoLinksContext';
import { useDoWithCoLinksContract } from './useDoWithCoLinksContract';
import { useLinkingStatus } from './useLinkingStatus';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

type BuyButtonProps = {
  setProgress(s: string): void;
  onSuccess(): void;
  target: string;
  disabled?: boolean;
  size?: ComponentProps<typeof Button>['size'];
  text?: string;
};

export const BuyButton = ({
  setProgress,
  onSuccess,
  target,
  disabled,
  size = 'medium',
  text = 'Buy Link',
}: BuyButtonProps) => {
  const { showError } = useToast();
  // const
  const queryClient = useQueryClient();
  const { awaitingWallet, setAwaitingWallet } = useContext(CoLinksContext);

  const currentUserAddress = useConnectedAddress(false);

  const { refresh } = useLinkingStatus({
    address: currentUserAddress,
    target: target,
  });

  const doWithCoLinksContract = useDoWithCoLinksContract();

  const syncLinks = async () => {
    await client.mutate(
      {
        syncLinks: { success: true },
      },
      {
        operationName: 'coLinks_sync_after_buysell',
      }
    );
  };
  const buyLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    await doWithCoLinksContract(buyLinkWithContract);
  };

  const buyLinkWithContract = async (
    signedContract: CoLinks,
    chainId: string
  ) => {
    try {
      console.log({ signedContract, chainId });
      assert(chainId);
      setAwaitingWallet(true);

      const value = await signedContract.getBuyPriceAfterFee(target, 1);

      console.log('try buy');
      const { receipt, error /*, tx*/ } = await sendAndTrackTx(
        () => {
          console.log({ signedContract });
          return signedContract.buyLinks(target, 1, {
            value,
          });
        },
        {
          showDefault: setProgress,
          description: `Buy CoLink`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: chainId,
          contract: signedContract,
        }
      );
      if (receipt) {
        setProgress('Done!');
        await syncLinks();
        await queryClient.invalidateQueries([QUERY_KEY_COLINKS]);
        onSuccess();
        setProgress('');
      } else if (error) {
        if (
          typeof error === 'string' &&
          error?.includes('Inexact payment amount')
        ) {
          showError(
            'Looks like someone bought this CoLink right before you. Please try again.',
            {
              autoClose: 5000,
              className: 'sniped',
            }
          );
          refresh();
          setProgress('');
        } else if (
          typeof error === 'string' &&
          error?.includes('transaction failed')
        ) {
          // TODO: show art overlay
          showError(
            'Wowza, you got front run! Another tx to buy this same link happened right before you. Please try again.',
            {
              autoClose: 5000,
              className: 'sniped',
            }
          );
          refresh();
          setProgress('');
        } else {
          console.error(error);
          showError(error);
          setProgress('');
        }
      } else {
        showError('no transaction receipt');
        setProgress('');
      }
    } catch (e: any) {
      showError('Error buying CoLink: ' + e.message);
      setProgress('');
    } finally {
      setAwaitingWallet(false);
    }
  };

  return (
    <Button
      size={size}
      onClick={buyLink}
      color="cta"
      disabled={awaitingWallet || disabled}
    >
      {text}
    </Button>
  );
};
