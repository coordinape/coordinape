import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { createNominee } from 'lib/gql/mutations';
import isEmpty from 'lodash/isEmpty';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import * as z from 'zod';

import { zEthAddress } from 'forms/formHelpers';
import { useSelectedCircle } from 'recoilState/app';
import {
  Form,
  Button,
  Modal,
  Text,
  TextField,
  FormLabel,
  Box,
  TextArea,
} from 'ui';

const schema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    address: zEthAddress,
    description: z
      .string()
      .min(40, 'Description must be at least 40 characters long.'),
  })
  .strict();

type NominateFormSchema = z.infer<typeof schema>;

const labelStyles = {
  lineHeight: '$short',
  color: '$text',
  fontSize: '$4',
  fontFamily: 'Inter',
  fontWeight: '$bold',
  textAlign: 'center',
  mb: '$sm',
};

export const NewNominationModal = ({
  onClose,
  visible,
  refetchNominees,
}: {
  visible: boolean;
  onClose: () => void;
  refetchNominees: () => void;
}) => {
  const { circle } = useSelectedCircle();
  const [submitting, setSubmitting] = useState(false);

  const nominateDescription = circle
    ? `The ${circle.name} Circle requires ${
        circle.min_vouches
      } people total to vouch for a new member and nominations are live for ${
        circle.nomination_days_limit
      } ${(circle.nomination_days_limit || 0) > 1 ? 'days' : 'day'}. ${
        (circle.min_vouches || 0) > 2
          ? `If a nomination does not receive ${
              circle.min_vouches - 1
            } additional ${
              circle.min_vouches > 3 ? 'vouches' : 'vouch'
            } in that period, the nomination fails.`
          : ''
      }`
    : '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NominateFormSchema>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const { field: name } = useController({
    name: 'name',
    control,
    defaultValue: '',
  });

  const { field: address } = useController({
    name: 'address',
    control,
    defaultValue: '',
  });

  const { field: description } = useController({
    name: 'description',
    control,
    defaultValue: '',
  });

  const onSubmit: SubmitHandler<NominateFormSchema> = async data => {
    setSubmitting(true);
    createNominee(circle.id, data)
      .then(refetchNominees)
      .then(onClose)
      .catch(console.warn);
  };
  return (
    <Modal title="Nominate New Member" open={visible} onClose={onClose}>
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
          maxHeight: '100vh',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Text css={{ lineHeight: '$normal', mb: '$lg' }}>
          {nominateDescription}
        </Text>
        <Box
          css={{
            display: 'grid',
            width: '100%',
            mb: '$md',
            'grid-template-columns': '1fr 1fr',
            'grid-template-rows': 'auto auto',
            'column-gap': '$lg',
          }}
        >
          <FormLabel htmlFor="name" css={labelStyles}>
            Name
          </FormLabel>
          <FormLabel htmlFor="address" css={labelStyles}>
            ETH Address
          </FormLabel>
          <TextField
            css={{ height: '$2xl', width: '100%' }}
            id="name"
            {...name}
          />

          <TextField
            css={{ height: '$2xl', width: '100%' }}
            id="address"
            {...address}
          />
          <Box
            css={{
              'grid-column': '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              mt: '$1xl',
            }}
          >
            <FormLabel htmlFor="description" css={labelStyles}>
              Why are you nominating this person?
            </FormLabel>
            <TextArea
              rows={4}
              id="description"
              {...description}
              maxLength={280}
              placeholder="Tell us why the person should be added to the circle, such as what they have achieved or what they will do in the future."
              css={{
                width: '100%',
                ta: 'left',
                p: '0 $sm',
                fontWeight: '$light',
                fontSize: '$4',
                lineHeight: '$base',
                color: '$text',
              }}
            />
          </Box>
        </Box>
        {!isEmpty(errors) && (
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 0,
              color: '$red',
            }}
          >
            {Object.values(errors).map((error, i) => (
              <div key={i}>{error.message}</div>
            ))}
          </Box>
        )}
        <Button
          css={{ mt: '$lg', gap: '$xs' }}
          color="red"
          size="medium"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Nominate Member'}
        </Button>
      </Form>
    </Modal>
  );
};

export default NewNominationModal;
