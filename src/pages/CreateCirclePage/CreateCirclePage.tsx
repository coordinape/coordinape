import { useMemo } from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import uniqBy from 'lodash/uniqBy';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FormAutocomplete, FormTextField } from 'components';
import CreateCircleForm from 'forms/CreateCircleForm';
import { useApiWithProfile } from 'hooks';
import { useMyProfile } from 'recoilState/app';
import * as paths from 'routes/paths';
import { Box, Button, Panel, Text, Tooltip } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const SummonCirclePage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // const { myUser } = useSelectedCircle();

  const { address: myAddress, myUsers } = useMyProfile();

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
    protocol_name: org?.name,
    user_name: myUsers.find(u => u !== undefined)?.name,
  };

  return (
    <SingleColumnLayout>
      <Text h1 css={{ mb: '$sm' }}>
        Create a Circle
      </Text>
      <Text
        variant="p"
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
                const newCircle = await createCircle({ ...params });
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
                          <InfoCircledIcon />
                        </Tooltip>
                      </Text>
                      <FormTextField
                        {...fields.protocol_name}
                        placeholder="Organization Name"
                        fullWidth
                      />
                    </div>
                  )}
                  <div>
                    <FormTextField
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
                  <FormTextField
                    {...fields.user_name}
                    label="Username"
                    placeholder="Your name in this circle"
                    fullWidth
                  />
                  <FormTextField
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
