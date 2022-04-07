import { ethers } from 'ethers';
import isEmpty from 'lodash/isEmpty';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { useApiWithSelectedCircle } from 'hooks';
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

type NominateFormValues = {
  name: string;
  address: string;
  description: string;
};
const intialValues = {
  name: '',
  address: '',
  description: '',
};

export const NewNominationModal = ({
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { circle } = useSelectedCircle();
  const { nominateUser } = useApiWithSelectedCircle();

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
  } = useForm<NominateFormValues>({ mode: 'all' });

  const onSubmit: SubmitHandler<NominateFormValues> = async data => {
    nominateUser({
      ...data,
    })
      .then(() => {
        onClose();
      })
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
        <Text css={{ lineHeight: 'normal' }}>{nominateDescription}</Text>
        <Box
          css={{
            display: 'grid',
            width: '100%',
            'grid-template-columns': '1fr 1fr',
            'grid-template-rows': 'auto auto',
            'column-gap': '$lg',
            'row-gap': '$xl',
          }}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <FormLabel
              htmlFor="name"
              css={{
                lineHeight: '1.3',
                color: '$text',
                fontSize: '$4',
                fontFamily: 'Inter',
                fontWeight: '$bold',
                textAlign: 'center',
                m: '0 0 $sm',
              }}
            >
              Name
            </FormLabel>
            <Controller
              name={'name'}
              defaultValue={intialValues.name}
              rules={{
                required: 'Name must be at least 3 characters long.',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters long.',
                },
              }}
              control={control}
              render={({ field }) => (
                <TextField
                  css={{ height: '48px', width: '100%' }}
                  id="name"
                  {...field}
                />
              )}
            />
          </Box>
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <FormLabel
              htmlFor="address"
              css={{
                lineHeight: '1.3',
                color: '$text',
                fontSize: '$4',
                fontFamily: 'Inter',
                fontWeight: '$bold',
                textAlign: 'center',
                m: '0 0 $sm',
              }}
            >
              ETH Address
            </FormLabel>
            <Controller
              name={'address'}
              defaultValue={intialValues.address}
              control={control}
              rules={{
                validate: value =>
                  ethers.utils.isAddress(value) || 'Invalid address',
              }}
              render={({ field }) => (
                <TextField
                  css={{ height: '48px', width: '100%' }}
                  id="address"
                  {...field}
                />
              )}
            />
          </Box>
          <Box
            css={{
              'grid-column': '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <FormLabel
              htmlFor="description"
              css={{
                lineHeight: '1.3',
                color: '$text',
                fontSize: '$4',
                fontFamily: 'Inter',
                fontWeight: '$bold',
                textAlign: 'center',
                m: '0 0 $sm',
              }}
            >
              Why are you nominating this person?
            </FormLabel>
            <Controller
              name={'description'}
              defaultValue={intialValues.description}
              control={control}
              rules={{
                required: 'Description must be at least 40 characters long.',
                minLength: {
                  value: 40,
                  message: 'Description must be at least 40 characters long.',
                },
              }}
              render={({ field }) => (
                <TextArea
                  rows={4}
                  id="description"
                  {...field}
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
              )}
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
        >
          Nominate Member
        </Button>
      </Form>
    </Modal>
  );
};

export default NewNominationModal;
