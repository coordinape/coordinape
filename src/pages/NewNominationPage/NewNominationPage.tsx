import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { createNominee } from 'lib/gql/mutations';
import isEmpty from 'lodash/isEmpty';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as z from 'zod';

import { zEthAddress } from 'forms/formHelpers';
import { Check, Info } from 'icons/__generated';
import { QUERY_KEY_ACTIVE_NOMINEES } from 'pages/AdminPage/getActiveNominees';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import {
  Form,
  Button,
  Text,
  TextField,
  FormLabel,
  Box,
  TextArea,
  AppLink,
  Flex,
  Panel,
  Tooltip,
} from 'ui';
import BackButton from 'ui/BackButton';
import HintButton from 'ui/HintButton';
import { SingleColumnLayout } from 'ui/layouts';

const schema = z
  .object({
    name: z.string().refine(val => val.trim().length >= 3, {
      message: 'Name must be at least 3 characters long.',
    }),
    address: zEthAddress,
    description: z
      .string()
      .min(40, 'Description must be at least 40 characters long.'),
  })
  .strict();

type NominateFormSchema = z.infer<typeof schema>;

interface errorObj {
  message: string;
}
function addServerErrors<T>(
  errors: errorObj[],
  setError: (
    fieldName: keyof T,
    error: { type: string; message: string | undefined }
  ) => void
) {
  return errors.forEach((err, key) => {
    setError(key as keyof T, { type: 'server', message: err.message });
  });
}

export const NewNominationPage = () => {
  const { circle } = useSelectedCircle();
  const [submitting, setSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [nomineeName, setNomineeName] = useState('');

  const queryClient = useQueryClient();

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
    setError,
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
    setIsSuccessful(false);
    createNominee(circle.id, data)
      .then(() => {
        queryClient.invalidateQueries(QUERY_KEY_ACTIVE_NOMINEES);
      })
      .then(() => {
        setIsSuccessful(true);
        setSubmitting(false);
        setNomineeName(name.value);
      })
      .catch(err => {
        if (err.response?.errors?.length > 0) {
          err = err.response.errors;
          setSubmitting(false);
          addServerErrors(err, setError);
        }
      });
  };
  return (
    <SingleColumnLayout>
      <Box>
        <AppLink to={paths.members(circle.id)}>
          <BackButton />
        </AppLink>
      </Box>
      <Flex css={{ alignItems: 'center', mb: '$sm' }}>
        <Text h1>Nominate Member</Text>
      </Flex>
      <Box css={{ mb: '$md' }}>
        <Text inline semibold>
          Vouch by circle members required.{' '}
        </Text>
        <Text inline>{nominateDescription}</Text>
      </Box>
      <Form
        css={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: 'white',
          width: '100%',
          padding: '0 0 $lg',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Panel
          css={{
            width: '100%',
          }}
        >
          <Panel
            nested
            css={{
              width: '70%',
              '@md': {
                width: '100%',
              },
            }}
          >
            <Box
              css={{
                display: 'grid',
                mb: '$md',
                'grid-template-columns': '1fr 1fr',
                'grid-template-rows': 'auto auto',
                'column-gap': '$lg',
              }}
            >
              <FormLabel htmlFor="name" type="label">
                Name
                <Tooltip
                  content={
                    <div>
                      Nominee name that will be displayed to other members for
                      vouching
                    </div>
                  }
                >
                  <Info size="sm" />
                </Tooltip>
              </FormLabel>
              <FormLabel htmlFor="address" type="label">
                ETH Address
                <Tooltip
                  content={
                    <div>
                      Eth address that will be used by Nominee to login to the
                      circle
                    </div>
                  }
                >
                  <Info size="sm" />
                </Tooltip>
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
                <FormLabel htmlFor="description" type="label">
                  Why are you nominating this person?
                  <Tooltip
                    content={
                      <div>
                        Nominee description that will introduce the nominee to
                        the vouchers
                      </div>
                    }
                  >
                    <Info size="sm" />
                  </Tooltip>
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
                    fontSize: '$medium',
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
                  color: '$alert',
                }}
              >
                {Object.values(errors).map((error, i) => (
                  <div key={i}>{error.message}</div>
                ))}
              </Box>
            )}
            <Button
              css={{ mt: '$lg', gap: '$xs' }}
              color="primary"
              outlined
              size="large"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Nominate Member'}
            </Button>
          </Panel>
          {isSuccessful && (
            <Panel success css={{ mt: '$xl' }}>
              <Flex>
                <Check color="successDark" size="lg" css={{ mr: '$md' }} />
                <Text size="large">
                  You have successfully Nominated {nomineeName} to the circle
                </Text>
              </Flex>
            </Panel>
          )}
          <Box css={{ mt: '$md' }}>
            <HintButton
              href={
                'https://docs.coordinape.com/get-started/members/vouching-new-members'
              }
            >
              Documentation: Learn More About Vouching
            </HintButton>
          </Box>
        </Panel>
      </Form>
    </SingleColumnLayout>
  );
};
