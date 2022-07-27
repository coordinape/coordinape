import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { useForm, useController } from 'react-hook-form';
import * as z from 'zod';

import { numberWithCommas } from 'utils';
import { FormTokenField } from 'components';
import { useContracts } from 'hooks/useContracts';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { Form, Button, Modal } from 'ui';

export type WithdrawModalProps = {
  onClose: () => void;
  onWithdraw: () => void;
  vault: GraphQLTypes['vaults'];
  balance: number;
};
export default function WithdrawModal({
  onClose,
  onWithdraw,
  vault,
  balance,
}: WithdrawModalProps) {
  const schema = z.object({ amount: z.number().min(0).max(balance) }).strict();
  type WithdrawFormSchema = z.infer<typeof schema>;
  const contracts = useContracts();
  const [submitting, setSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<WithdrawFormSchema>({
    mode: 'all',
    resolver: zodResolver(schema),
  });
  const { field: amountField } = useController({
    name: 'amount',
    control,
    defaultValue: 0,
  });
  const { withdraw } = useVaultRouter(contracts);

  const onSubmit = () => {
    setSubmitting(true);
    withdraw(vault, amountField.value.toString(), true).then(({ error }) => {
      setSubmitting(false);
      if (error) return;
      onWithdraw();
      onClose();
    });
  };

  return (
    <Modal title="Withdraw Tokens From Vault" open={true} onClose={onClose}>
      <Form
        css={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          padding: '0 0 $lg',
          overflowY: 'auto',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormTokenField
          max={balance}
          symbol={vault.symbol}
          decimals={vault.decimals}
          label={`Available to Withdraw: ${numberWithCommas(
            balance
          )} ${vault.symbol?.toUpperCase()}`}
          error={!!errors.amount}
          errorText={errors.amount?.message}
          {...amountField}
        />
        <Button
          css={{ mt: '$lg', gap: '$xs' }}
          color="primary"
          outlined
          size="medium"
          type="submit"
          disabled={!isValid || submitting}
        >
          {submitting
            ? 'Withdrawing Funds...'
            : `Withdraw ${vault.symbol.toUpperCase()}`}
        </Button>
      </Form>
    </Modal>
  );
}
