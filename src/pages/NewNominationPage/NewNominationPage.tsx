import assert from 'assert';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { isAddress } from 'ethers/lib/utils';
import { client } from 'lib/gql/client';
import { createNominee } from 'lib/gql/mutations';
import { zEthAddress } from 'lib/zod/formHelpers';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import * as z from 'zod';

import { FormInputField } from 'components';
import { useToast } from 'hooks';
import { Check } from 'icons/__generated';
import { QUERY_KEY_GET_MEMBERS_PAGE_DATA } from 'pages/MembersPage/getMembersPageData';
import { useCircleIdParam } from 'routes/hooks';
import { Form, ContentHeader, Button, Text, Box, Flex, Panel, Link } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

const schema = z
  .object({
    name: z.string().refine(val => val.trim().length >= 3, {
      message: 'Name must be at least 3 characters long.',
    }),
    address: zEthAddress,
    description: z.string().min(1, 'May not be blank.'),
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
  const { showError } = useToast();
  const circleId = useCircleIdParam();
  const { data } = useQuery(['NominationPage', circleId], () =>
    client.query(
      {
        circles_by_pk: [
          { id: circleId },
          {
            name: true,
            min_vouches: true,
            nomination_days_limit: true,
          },
        ],
      },
      { operationName: 'NewNominationPage_getCircleData' }
    )
  );
  const circle = data?.circles_by_pk;
  const [submitting, setSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [nomineeName, setNomineeName] = useState('');
  const [profileName, setProfileName] = useState(undefined);
  const [isFetched, setIsFetched] = useState<boolean>(false);

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
    setValue,
    formState: { isValid },
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

  const { field: description, fieldState: addressFieldState } = useController({
    name: 'description',
    control,
    defaultValue: '',
  });

  useEffect(() => {
    if (!addressFieldState.error && isAddress(address.value)) {
      const getName = async () => {
        try {
          const { profiles } = await client.query(
            {
              profiles: [
                {
                  where: { address: { _ilike: address.value } },
                  limit: 1,
                },
                { name: true },
              ],
            },
            { operationName: 'NewNomination_getUserName' }
          );
          assert(profiles, 'failed to fetch user profiles');

          const name = profiles[0]?.name ?? '';
          if (name.length > 0) {
            setValue('name', name);
            setIsFetched(true);
          } else {
            // re-enable name input if there is no name stored
            setIsFetched(false);
          }
        } catch (e: any) {
          setIsFetched(false);
          const errorMessage = e.message;
          if (errorMessage)
            console.error(e, `profile address:${address.value}`);
        }
      };
      getName();
    } else {
      // re-enable name input when the address be not valid
      setIsFetched(false);
    }
  }, [addressFieldState.error?.message, address.value]);

  const onSubmit: SubmitHandler<NominateFormSchema> = async data => {
    setSubmitting(true);
    setIsSuccessful(false);
    createNominee(circleId, data)
      .then(res => {
        const storedName = res?.nominee?.profile?.name;
        setIsSuccessful(true);
        setSubmitting(false);
        setNomineeName(name.value);
        if (storedName && storedName !== data.name) setProfileName(storedName);
      })
      .then(() => {
        queryClient.invalidateQueries(QUERY_KEY_GET_MEMBERS_PAGE_DATA);
      })
      .catch(err => {
        if (err.response?.errors?.length > 0) {
          err = err.response.errors;
          setSubmitting(false);
          err.map((e: Error) => {
            showError(e);
          });
          addServerErrors(err, setError);
        }
      });
  };
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Nominate Member</Text>
          <Text p as="p">
            <Text inline semibold>
              Vouch by circle members required.{' '}
            </Text>
            {nominateDescription}
          </Text>
        </Flex>
      </ContentHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Panel invertForm>
          <Flex column css={{ gap: '$md' }}>
            <Flex row css={{ gap: '$md' }}>
              <FormInputField
                id="name"
                name="name"
                css={{ width: '100%' }}
                control={control}
                disabled={isFetched}
                label="Name"
                infoTooltip="Nominee name that will be displayed to other members for
                  vouching"
                showFieldErrors
              />

              <FormInputField
                id="address"
                css={{ width: '100%' }}
                {...address}
                control={control}
                label="Wallet Address"
                infoTooltip="Eth address that will be used by Nominee to login to the
                  circle"
                showFieldErrors
              />
            </Flex>

            <FormInputField
              textArea
              areaProps={{
                placeholder:
                  'Tell us why the person should be added to the circle, such as what they have achieved or what they will do in the future.',
              }}
              id="description"
              {...description}
              control={control}
              label="Why are you nominating this person?"
              infoTooltip="Nominee description that will introduce the nominee to the
                  vouchers"
              showFieldErrors
            />

            <Button
              css={{ mt: '$lg', gap: '$xs' }}
              color="primary"
              size="large"
              type="submit"
              disabled={!isValid || submitting}
            >
              {submitting ? 'Saving...' : 'Nominate Member'}
            </Button>
          </Flex>
          {isSuccessful && (
            <>
              <Text
                tag
                color="complete"
                css={{ mt: '$xl', py: '$sm', height: 'auto' }}
              >
                <Flex css={{ gap: '$sm' }}>
                  <Check />
                  You have successfully nominated {nomineeName} to the circle
                </Flex>
              </Text>
              {profileName && (
                <Panel alert css={{ mt: '$xl' }}>
                  <Text size="large">
                    This address matches an existing account in our system, so
                    their name will be used:
                  </Text>
                  <Text>
                    &ldquo;{profileName}&ldquo; will be used instead of &ldquo;
                    {nomineeName}&ldquo;
                  </Text>
                </Panel>
              )}
            </>
          )}
          <Box css={{ mt: '$md' }}>
            <Link
              inlineLink
              target="_blank"
              rel="noreferrer"
              href={
                'https://docs.coordinape.com/get-started/members/vouching-new-members'
              }
            >
              Documentation: Learn More About Vouching
            </Link>
          </Box>
        </Panel>
      </Form>
    </SingleColumnLayout>
  );
};
