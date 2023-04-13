import assert from 'assert';
import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { QUERY_KEY_NAV } from 'features/nav/getNavData';
import { getOrgData, QUERY_KEY_ORG_DATA } from 'features/orgs/getOrgData';
import { fileToBase64 } from 'lib/base64';
import { updateOrgLogo } from 'lib/gql/mutations';
import { MAX_IMAGE_BYTES_LENGTH_BASE64 } from 'lib/images';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';
import * as z from 'zod';

import { useFetchManifest } from '../../hooks/legacyApi';
import { QUERY_KEY_LOGIN_DATA } from '../auth/useLoginData';
import { GuildInfoWithMembership } from '../guild/guild-api';
import { GuildSelector } from '../guild/GuildSelector';
import { FormInputField, LoadingModal } from 'components';
import { useToast } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Check, Info } from 'icons/__generated';
import { paths } from 'routes/paths';
import {
  Avatar,
  Box,
  Button,
  ContentHeader,
  Flex,
  Form,
  Link,
  Panel,
  Text,
  Tooltip,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { formatBytes } from 'utils/presentationHelpers';

import { updateOrg } from './mutations';

type OrgAdminFormSchema = z.infer<typeof schema>;

const schema = z.object({
  name: z
    .string()
    .max(70, {
      message: 'Organization name is too long: max 70 characters.',
    })
    .refine(val => val.trim().length >= 3, {
      message: 'Organization name is too short: 3+ characters required.',
    }),
  telegram_id: z.string().max(70).optional(),
  orgLogo: z.instanceof(File).optional(),
  guild_id: z.optional(z.number().or(z.string())),
  guild_role_id: z.optional(z.string()),
});

export const OrgSettingsPage = () => {
  const orgId = Number.parseInt(useParams().orgId ?? '-1');
  const navigate = useNavigate();
  const address = useConnectedAddress();
  const queryClient = useQueryClient();
  const { hash } = useLocation();
  const fetchManifest = useFetchManifest();

  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollToGuild = (element: HTMLDivElement) => {
    if (element && !hasScrolled && hash === '#guild') {
      element.scrollIntoView(true);
      setHasScrolled(true);
    }
  };

  const { data, refetch, isLoading, isIdle, isRefetching } = useQuery(
    [QUERY_KEY_ORG_DATA, orgId],
    () => getOrgData(orgId, address as string),
    {
      enabled: !!address,
      staleTime: Infinity,
    }
  );

  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<undefined | string>(
    undefined
  );

  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const org = data?.organizations_by_pk;

  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);

  const onSubmit: SubmitHandler<OrgAdminFormSchema> = async data => {
    try {
      const d = {
        ...data,
        // these need to be null to clear them
        guild_id: guildInfo?.id ?? null,
        guild_role_id: data.guild_role_id ?? null,
      };
      await updateOrg(orgId, d);
      refetch();
      await fetchManifest();
      await queryClient.invalidateQueries(QUERY_KEY_LOGIN_DATA);
    } catch (e) {
      console.warn(e);
    }
    reset(data);
  };

  const fileInput = React.createRef<HTMLInputElement>();

  const VALID_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

  const { showError } = useToast();

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      if (!VALID_FILE_TYPES.includes(e.target.files[0].type)) {
        showError(
          e.target.value +
            ' is invalid, allowed files are: ' +
            VALID_FILE_TYPES.join(', ')
        );
        setLogoFile(undefined);
      } else if (e.target.files[0].size > MAX_IMAGE_BYTES_LENGTH_BASE64) {
        showError(
          e.target.value +
            ' is too large, max file size is ' +
            formatBytes(MAX_IMAGE_BYTES_LENGTH_BASE64)
        );
      } else {
        setLogoFile(e.target.files[0]);
        const newLogo = e.target.files[0];
        if (newLogo === undefined) {
          return;
        }
        let response = undefined;
        try {
          response = await uploadLogo(orgId, newLogo);
          assert(response?.uploadOrgLogo?.org?.logo);
          queryClient.invalidateQueries(QUERY_KEY_NAV);
          queryClient.invalidateQueries(QUERY_KEY_ORG_DATA);
        } catch (e: any) {
          showError(e);
          setLogoFile(undefined);
          return;
        }
        setUploadedLogoUrl(response.uploadOrgLogo.org.logo);
        setLogoFile(undefined);
        setUploadComplete(true);
      }
    }
  };

  const uploadLogo = async (orgId: number, logo: File) => {
    const image_data_base64 = await fileToBase64(logo);
    return await updateOrgLogo(orgId, image_data_base64);
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
    watch,
    setValue,
    register,
  } = useForm<OrgAdminFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: org?.name,
      telegram_id: org?.telegram_id || '',
    },
  });

  const watchGuild = watch('guild_id');

  const [guildInfo, setGuildInfo] = useState<
    GuildInfoWithMembership | undefined
  >(undefined);

  if (isLoading || isIdle || isRefetching || logoFile)
    return <LoadingModal visible note="OrganizationPage" text="Saving..." />;

  if (!org) {
    navigate(paths.home);
    return <></>;
  }

  return (
    <Form id="org_settings">
      <SingleColumnLayout>
        <ContentHeader sticky>
          <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
            <Text h1>Organization Admin</Text>
          </Flex>
          <Button
            color="cta"
            type="submit"
            form="circle_admin"
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            Save Settings
          </Button>
        </ContentHeader>

        <Panel settings>
          <Text h2>General</Text>
          <Panel css={{ p: '$sm 0' }}>
            <Text large semibold css={{ mb: '$sm' }}>
              Organization Settings
            </Text>
            <Text p as="p" size="small">
              Organizations can have many Circles with them and help with
              organizing groups working within the same organization.{' '}
              <span>
                <Link
                  href="https://docs.coordinape.com/get-started/admin/update-organization-settings"
                  rel="noreferrer"
                  target="_blank"
                >
                  Read The Docs.
                </Link>
              </span>
            </Text>
            <Box
              css={{
                mt: '$lg',
                display: 'grid',
                gridTemplateColumns: `1fr 1fr 1fr`,
                gap: '$lg',
                '@sm': { gridTemplateColumns: '1fr' },
              }}
            >
              <FormInputField
                id="name"
                name="name"
                control={control}
                defaultValue={org?.name}
                label="Organization Name"
                infoTooltip="The name of the Organization, which is visible to all circles' members."
                showFieldErrors
              />

              <FormInputField
                id="telegram_id"
                name="telegram_id"
                control={control}
                defaultValue={org?.telegram_id}
                label="Telegram Notifications Chat ID"
                infoTooltip="Reach out on Discord for detailed instructions setting up telegram notifications."
                showFieldErrors
              />
              <Flex column alignItems="start" css={{ gap: '$xs' }}>
                <Text variant="label" as="label">
                  Organization logo
                  <Tooltip
                    css={{ ml: '$xs' }}
                    content={<div>Upload a logo for your organization</div>}
                  >
                    <Info size="sm" />
                  </Tooltip>
                </Text>

                <Flex
                  alignItems="center"
                  css={{
                    gap: '$sm',
                    width: '100%',
                  }}
                >
                  <Avatar
                    size="medium"
                    margin="none"
                    path={uploadedLogoUrl ? uploadedLogoUrl : org.logo}
                    name={org?.name}
                  />
                  <Flex
                    alignItems="center"
                    css={{
                      gap: '$sm',
                    }}
                  >
                    <Button
                      color="secondary"
                      as="span"
                      css={{
                        display: 'inline-flex',
                      }}
                      onClick={() => {
                        setUploadComplete(false);
                        fileInput.current?.click?.();
                      }}
                    >
                      Select File
                    </Button>
                    {uploadComplete && (
                      <Text
                        size="small"
                        color="neutral"
                        css={{
                          gap: '$xs',
                        }}
                      >
                        <Check /> Logo Saved!
                      </Text>
                    )}
                    <input
                      ref={fileInput}
                      accept={VALID_FILE_TYPES.join(', ')}
                      onChange={onInputChange}
                      style={{ display: 'none' }}
                      type="file"
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </Panel>
        </Panel>
        <Panel settings>
          <Text h2>Integrations</Text>
          <Panel css={{ p: '$sm 0' }}>
            <Box>
              <Text
                ref={scrollToGuild}
                id="guild"
                large
                semibold
                css={{ mb: '$md' }}
              >
                Guild.xyz
              </Text>

              <GuildSelector
                formControl={control}
                guildInput={watchGuild}
                guild_role_id={org.guild_role_id}
                guild_id={org.guild_id}
                guildInfo={guildInfo}
                setGuildInfo={setGuildInfo}
                setValue={setValue}
                register={register}
                isOrg={true}
              />
            </Box>
          </Panel>
        </Panel>
      </SingleColumnLayout>
    </Form>
  );
};
