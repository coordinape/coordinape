import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { fileToBase64 } from 'lib/base64';
import uniqBy from 'lodash/uniqBy';
import { useForm, useController, SubmitHandler } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
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
      message: 'Circle Point of Contact is Required.',
    }),
  })
  .strict();

export const SummonCirclePage = () => {
  const navigate = useNavigate();
  // const { myUser } = useSelectedCircle();

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

  const onSubmit: SubmitHandler<CircleFormSchema> = async data => {
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
  };

  type CircleFormSchema = z.infer<typeof schema>;

  const { control, handleSubmit } = useForm<CircleFormSchema>({
    resolver: zodResolver(schema),
    mode: 'all',
  });
  const { field: organizationName, fieldState: orgNameFieldState } =
    useController({
      name: 'organization_name',
      control,
      defaultValue: '',
    });
  const { field: organizationId } = useController({
    name: 'organization_id',
    control,
    defaultValue: undefined,
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
          <Form onSubmit={handleSubmit(onSubmit)}>
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
                      content={
                        <div>Upload a logo to your circle, Max 3MBs</div>
                      }
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
                    {...organizationName}
                    value={organizationName.value}
                    error
                    errorText={orgNameFieldState.error?.message}
                    onChange={(v: string) => {
                      const id = organizations.find(p => p.name === v)?.id;
                      organizationId?.onChange(id);
                      organizationName.onChange(v);
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
                      infoTooltip="A circle admin can add to an existing organization."
                      label="Organization"
                      css={{ width: '100%' }}
                      defaultValue=""
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
                    css={{ width: '100%' }}
                    infoTooltip="New Circle's name"
                    defaultValue=""
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
                  infoTooltip="Your name in this circle"
                  css={{ width: '100%' }}
                  defaultValue=""
                  showFieldErrors
                />
                <FormInputField
                  id="contact"
                  name="contact"
                  control={control}
                  css={{ width: '100%' }}
                  label="Email Address"
                  infoTooltip="Point of contact email"
                  defaultValue=""
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
                  css={{ whiteSpace: 'nowrap' }}
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
