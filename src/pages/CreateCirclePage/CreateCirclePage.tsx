import { useMemo, useState } from 'react';

import { fileToBase64 } from 'lib/base64';
import uniqBy from 'lodash/uniqBy';
import { useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FormAutocomplete, DeprecatedFormTextField } from 'components';
import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import CreateCircleForm from 'forms/CreateCircleForm';
import { useApiWithProfile } from 'hooks';
import { Info } from 'icons/__generated';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { useMyProfile } from 'recoilState/app';
import * as paths from 'routes/paths';
import { Box, Button, Flex, FormLabel, Avatar, Panel, Text, Tooltip } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { getCircleAvatar } from 'utils/domain';

export const SummonCirclePage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
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

  const protocols = useMemo(
    () =>
      uniqBy(
        myUsers
          .filter(u => u.isCircleAdmin)
          .map(({ circle: { protocol } }) => protocol),
        'id'
      ),
    [myUsers]
  );

  const { createCircle } = useApiWithProfile();

  if (!myAddress) {
    return (
      <div>
        <h2>Connect your wallet to create a circle.</h2>
      </div>
    );
  }

  const org = protocols.find(p => p.id === Number(params.get('org')));
  const source = {
    protocol_id: org?.id,
    protocol_name: org?.name || '',
    user_name: myUsers.find(u => u !== undefined)?.name,
  };

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
          <CreateCircleForm.FormController
            source={source}
            submit={async ({ ...params }) => {
              try {
                const image_data_base64 = logoData.avatarRaw
                  ? await fileToBase64(logoData.avatarRaw)
                  : undefined;
                const newCircle = await createCircle({
                  ...params,
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
            }}
          >
            {({ fields, handleSubmit }) => (
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
                  {protocols.length ? (
                    <FormAutocomplete
                      {...fields.protocol_name}
                      value={fields.protocol_name.value}
                      onChange={(v: string) => {
                        const id = protocols.find(p => p.name === v)?.id;
                        fields.protocol_id?.onChange(id);
                        fields.protocol_name.onChange(v);
                      }}
                      options={protocols.map(p => p.name)}
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
                      <DeprecatedFormTextField
                        {...fields.protocol_name}
                        placeholder="Organization Name"
                        fullWidth
                      />
                    </div>
                  )}
                  <div>
                    <DeprecatedFormTextField
                      {...fields.circle_name}
                      label="Circle Name"
                      placeholder="Circle Name"
                      fullWidth
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
                  <DeprecatedFormTextField
                    {...fields.user_name}
                    label="Username"
                    placeholder="Your name in this circle"
                    fullWidth
                  />
                  <DeprecatedFormTextField
                    {...fields.contact}
                    fullWidth
                    label="Email Address"
                    placeholder="Point of contact email"
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
                    onClick={handleSubmit}
                  >
                    Create Circle
                  </Button>
                </Box>
              </div>
            )}
          </CreateCircleForm.FormController>
        </Panel>
      </Panel>
    </SingleColumnLayout>
  );
};

export default SummonCirclePage;
