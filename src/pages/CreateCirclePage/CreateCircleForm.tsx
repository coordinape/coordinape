import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { QUERY_KEY_NAV } from 'features/nav/getNavData';
import { fileToBase64 } from 'lib/base64';
import uniqBy from 'lodash/uniqBy';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { FormAutocomplete, FormInputField } from 'components';
import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import { useApiWithProfile } from 'hooks';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { paths } from 'routes/paths';
import {
  Box,
  Button,
  ContentHeader,
  Flex,
  Avatar,
  Panel,
  Text,
  Form,
  InfoTooltip,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CreateSampleCircle } from './CreateSampleCircle';
import { CreateCircleQueryData } from './queries';

export const NEW_CIRCLE_CREATED_PARAMS = '?new-circle';

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

export const CreateCircleForm = ({
  myAddress,
  source,
}: {
  myAddress?: string;
  source: CreateCircleQueryData;
}) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const queryClient = useQueryClient();

  const [logoData, setLogoData] = useState<{
    avatar?: string;
    avatarRaw: File | null;
  }>({
    avatar: undefined,
    avatarRaw: null,
  });

  const { createCircle } = useApiWithProfile();
  const myUsers = source.myUsers;
  const organizations = useMemo(
    () =>
      uniqBy(
        myUsers
          .filter(u => u.role === 1)
          .map(({ circle: { organization } }) => organization),
        'id'
      ),
    [myUsers]
  );
  const org = organizations.find(p => p.id === Number(params.get('org')));
  const hasSampleOrg = organizations.find(o => o.sample);

  const circleCreated = (circleId: number) => {
    queryClient.invalidateQueries(QUERY_KEY_MY_ORGS);
    queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
    queryClient.invalidateQueries(QUERY_KEY_NAV);
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
      user_name:
        source.myProfile?.name ?? myUsers.find(u => u !== undefined)?.name,
      circle_name: '',
      organization_name: org?.name || '',
      contact: '',
      organization_id: org?.id,
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
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Create a Circle</Text>
          <Text p as="p">
            Coordinape circles allow you to collectively reward circle members
            through equitable and transparent payments. To start a circle, we
            need just a bit of information.
          </Text>
        </Flex>
      </ContentHeader>
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
        <Panel>
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
                    <InfoTooltip>Upload a logo to your circle</InfoTooltip>
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
                    <Button as="div" color="secondary">
                      Upload File
                    </Button>
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
                <Text color="secondary">
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

export default CreateCircleForm;
