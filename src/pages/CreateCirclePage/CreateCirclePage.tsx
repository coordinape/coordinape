import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { fileToBase64 } from 'lib/base64';
import uniqBy from 'lodash/uniqBy';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { FormAutocomplete, FormInputField } from 'components';
import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import { useApiWithProfile } from 'hooks';
import { Info } from 'icons/__generated';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { useMyProfile } from 'recoilState/app';
import * as paths from 'routes/paths';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Avatar,
  Panel,
  Text,
  Tooltip,
  Form,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { getCircleAvatar } from 'utils/domain';

export const SummonCirclePage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const queryClient = useQueryClient();

  const { address: myAddress, myUsers } = useMyProfile();

  const [logoData, setLogoData] = useState<{
    avatar: string;
    avatarRaw: File | null;
  }>({
    avatar: getCircleAvatar({
      avatar: undefined,
      circleName: 'CO',
    }),
    avatarRaw: null,
  });

  const organizations = useMemo(
    () =>
      uniqBy(
        myUsers
          .filter(u => u.isCircleAdmin)
          .map(({ circle: { organization } }) => organization),
        'id'
      ),
    [myUsers]
  );

  const { createCircle } = useApiWithProfile();

  const org = organizations.find(p => p.id === Number(params.get('org')));
  const source = {
    organization_id: org?.id,
    organization_name: org?.name || '',
    user_name: myUsers.find(u => u !== undefined)?.name,
  };

  const schema = z
    .object({
      user_name: z.string().refine(val => val.trim().length >= 3, {
        message: 'Name must be at least 3 characters long.',
      }),
      circle_name: z.string().refine(val => val.trim().length >= 3, {
        message: 'Circle name must be at least 3 characters long.',
      }),
      organization_name: z.string().refine(val => val.trim().length >= 3, {
        message: 'Org name must be at least 3 characters long.',
      }),
      organization_id: z.number().optional(),
      contact: z.string().refine(val => val.trim().length >= 4, {
        message: 'Email must be at least 4 characters long.',
      }),
      logoData: z.instanceof(File).optional(),
    })
    .strict();

  type CreateCircleFormSchema = z.infer<typeof schema>;

  const onSubmit: SubmitHandler<CreateCircleFormSchema> = async data => {
    try {
      const image_data_base64 = logoData.avatarRaw
        ? await fileToBase64(logoData.avatarRaw)
        : undefined;
      const newCircle = await createCircle({
        ...data,
        image_data_base64,
      });
      queryClient.invalidateQueries(QUERY_KEY_MY_ORGS);
      queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
      navigate({
        pathname: paths.paths.members(newCircle.id),
        search: paths.NEW_CIRCLE_CREATED_PARAMS,
      });
    } catch (e) {
      console.warn(e);
    }
    reset(data);
  };

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<CreateCircleFormSchema>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      user_name: '',
      circle_name: '',
      organization_name: source.organization_name,
      contact: '',
      organization_id: source.organization_id,
    },
  });

  if (!myAddress) {
    return (
      <div>
        <h2>Connect your wallet to create a circle.</h2>
      </div>
    );
  }

  return (
    <SingleColumnLayout>
      <Text h1 css={{ mb: '$sm' }}>
        Create a Circle
      </Text>
      <Text
        p
        as="p"
        css={{
          mb: '$xl',
          width: '50%',
          '@sm': { width: '100%' },
        }}
      >
        Coordinape circles allow you to collectively reward circle members
        through equitable and transparent payments. To start a circle, we need
        just a bit of information.
      </Text>
      <Panel
        css={{
          mb: '$md',
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          gap: '$md',
          '@sm': { gridTemplateColumns: '1fr' },
        }}
      >
        <Box>
          <Text h2>Get Started</Text>
        </Box>
        <Panel nested>
          <Form id="create_circle_form">
            <div>
              <Box
                css={{
                  mb: '$md',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '$lg',
                  '@sm': { gridTemplateColumns: '1fr' },
                }}
              >
                <Flex column css={{ alignItems: 'flex-start', gap: '$xs' }}>
                  <Text variant="label" as="label">
                    Circle logo
                    <Tooltip
                      css={{ ml: '$xs' }}
                      content={<div>Upload a logo to your circle</div>}
                    >
                      <Info size="sm" />
                    </Tooltip>
                  </Text>
                  <Flex
                    row
                    css={{ alignItems: 'center', gap: '$sm', width: '100%' }}
                  >
                    <Avatar
                      size="medium"
                      margin="none"
                      path={logoData.avatar}
                    />
                    <FormLabel
                      htmlFor="upload-logo-button"
                      css={{ flexGrow: '1' }}
                    >
                      <Button as="div" color="primary" outlined>
                        Upload File
                      </Button>
                    </FormLabel>
                  </Flex>
                  <input
                    id="upload-logo-button"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files.length) {
                        setLogoData({
                          ...logoData,
                          avatar: URL.createObjectURL(e.target.files[0]),
                          avatarRaw: e.target.files[0],
                        });
                      }
                    }}
                    style={{ display: 'none' }}
                    type="file"
                  />
                </Flex>
                {organizations.length ? (
                  <FormAutocomplete
                    value={org?.name}
                    onChange={(v: string) => {
                      const id = organizations.find(p => p.name === v)?.id;
                      setValue('organization_id', id);
                      setValue('organization_name', v);
                    }}
                    options={organizations.map(p => p.name)}
                    label="Organization"
                    fullWidth
                    TextFieldProps={{
                      infoTooltip: (
                        <>
                          <p>Circles nest within Organizations.</p>
                          <p>
                            Example:
                            <br />
                            Org Name - Coordinape
                            <br />
                            Circle Name - Design Team
                          </p>
                        </>
                      ),
                    }}
                  />
                ) : (
                  <div>
                    <Text variant="label" css={{ width: '100%', mb: '$sm' }}>
                      Organization
                      <Tooltip
                        css={{ ml: '$xs' }}
                        content="A circle admin can add to an existing organization."
                      >
                        <Info size="sm" />
                      </Tooltip>
                    </Text>
                  </div>
                )}
                <div>
                  <FormInputField
                    id="circle_name"
                    name="circle_name"
                    control={control}
                    label="Circle Name"
                    showFieldErrors
                  />
                </div>
              </Box>
              <Box
                css={{
                  mb: '$md',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '$lg',
                  '@sm': { gridTemplateColumns: '1fr' },
                }}
              >
                <FormInputField
                  id="user_name"
                  name="user_name"
                  control={control}
                  label="Username"
                  showFieldErrors
                />
                <FormInputField
                  id="contact"
                  name="contact"
                  control={control}
                  label="Email Address"
                  showFieldErrors
                />
              </Box>
              <Box
                css={{
                  mt: '$lg',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexGrow: 1,
                }}
              >
                <Text color={'neutral'}>
                  You can always change these settings from the Admin panel.
                </Text>
                <Button
                  color="primary"
                  size="medium"
                  type="submit"
                  form="circle_admin"
                  outlined
                  disabled={!isValid}
                  css={{ whiteSpace: 'nowrap' }}
                  onClick={handleSubmit(onSubmit)}
                >
                  Create Circle
                </Button>
              </Box>
            </div>
          </Form>
        </Panel>
      </Panel>
    </SingleColumnLayout>
  );
};

export default SummonCirclePage;
