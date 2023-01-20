import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { fileToBase64 } from 'lib/base64';
import uniqBy from 'lodash/uniqBy';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { InvalidateSideNav } from '../../features/nav';
import { FormAutocomplete, FormInputField } from 'components';
import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import { useApiWithProfile } from 'hooks';
import { Info } from 'icons/__generated';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { useMyProfile } from 'recoilState/app';
import { paths } from 'routes/paths';
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

import { CreateSampleCircle } from './CreateSampleCircle';

export const NEW_CIRCLE_CREATED_PARAMS = '?new-circle';

export const SummonCirclePage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const queryClient = useQueryClient();

  const { address: myAddress, myUsers, name: profileName } = useMyProfile();

  const [logoData, setLogoData] = useState<{
    avatar?: string;
    avatarRaw: File | null;
  }>({
    avatar: undefined,
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
    user_name: profileName ?? myUsers.find(u => u !== undefined)?.name,
  };

  const hasSampleOrg = organizations.find(o => o.sample);

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
      contact: z.string().email(),
      logoData: z.instanceof(File).optional(),
    })
    .strict();

  type CreateCircleFormSchema = z.infer<typeof schema>;

  const circleCreated = (circleId: number) => {
    queryClient.invalidateQueries(QUERY_KEY_MY_ORGS);
    queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
    InvalidateSideNav(queryClient);
    navigate({
      pathname: paths.members(circleId),
      search: NEW_CIRCLE_CREATED_PARAMS,
    });
  };

  const onSubmit: SubmitHandler<CreateCircleFormSchema> = async data => {
    try {
      const image_data_base64 = logoData.avatarRaw
        ? await fileToBase64(logoData.avatarRaw)
        : undefined;
      const newCircle = await createCircle({
        ...data,
        image_data_base64,
      });
      circleCreated(newCircle.id);
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
      {!hasSampleOrg && (
        <Box css={{ mb: '$lg' }}>
          <Text variant="label" css={{ mb: '$sm' }}>
            Looking to explore and experiment?
          </Text>
          <CreateSampleCircle onFinish={circleCreated} />
        </Box>
      )}
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
                <Flex column alignItems="start" css={{ gap: '$xs' }}>
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
                    alignItems="center"
                    css={{ gap: '$sm', width: '100%' }}
                  >
                    <Avatar
                      name="CO"
                      size="medium"
                      margin="none"
                      path={logoData.avatar}
                    />
                    <FormLabel
                      htmlFor="upload-logo-button"
                      css={{ flexGrow: '1' }}
                    >
                      <Button as="div" color="secondary">
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
                    <FormInputField
                      id="organization_name"
                      name="organization_name"
                      control={control}
                      label="Organization"
                      infoTooltip={
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
                      }
                      showFieldErrors
                    />
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
                  color="secondary"
                  size="medium"
                  type="submit"
                  form="circle_admin"
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
