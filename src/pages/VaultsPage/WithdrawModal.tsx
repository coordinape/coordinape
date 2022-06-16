import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { createNominee } from 'lib/gql/mutations';
import isEmpty from 'lodash/isEmpty';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import * as z from 'zod';

import { FormTokenField } from 'components';
import { Form, Button, Modal, Text, FormLabel, TextArea } from 'ui';

export default function WithdrawModal({
  visible,
  onClose,
  vault,
}: {
  visible: boolean;
  onClose: () => void;
  vault: GraphQLTypes['vaults'];
}) {
  const [max, setMax] = useState<any>();
  console.info({ vault });
  return (
    <Modal title="Withdraw Tokens From Vault" open={visible} onClose={onClose}>
      <Text>Hello World</Text>
      <FormTokenField
        onChange={() => {}}
        max={500000}
        symbol={vault.symbol as string}
        decimals={vault.decimals}
        label={`Available to Withdraw: ${500000} ${vault.symbol?.toUpperCase()}`}
      />
    </Modal>
  );
}
