import { useMemo } from 'react';

import uniqBy from 'lodash/uniqBy';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button, makeStyles } from '@material-ui/core';

import { ApeTextField, FormAutocomplete, FormTextField } from 'components';
import CreateCircleForm from 'forms/CreateCircleForm';
import { useApiBase, useApiWithProfile } from 'hooks';
import { DiscordIcon } from 'icons';
import { useMyProfile } from 'recoilState/app';
import * as paths from 'routes/paths';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    lineHeight: 1,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: theme.spacing(7, 2, 2),
  },
  subtitle: {
    color: theme.colors.primary,
    fontWeight: 400,
    size: 20,
    lineHeight: 1.5,
    textAlign: 'center',
    marginBottom: theme.spacing(6),
  },
  bodyInner: {
    width: '100%',
    maxWidth: 815,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(0, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1, 1),
    },
  },
  twoColumnGrid: {
    display: 'grid',
    width: '100%',
    maxWidth: 800,
    gridTemplateColumns: '1fr 1fr',
    gridAutoRows: '1fr',
    columnGap: theme.spacing(1.8),
    rowGap: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
      gridAutoRows: '1fr',
    },
  },
  sectionTitle: {
    color: theme.colors.primary,
    textAlign: 'center',
    size: 10,
    lineHeight: 1.55,
    fontWeight: 300,
    margin: theme.spacing(5, 0, 2.2),
  },
  saveButton: {
    margin: theme.spacing(3, 0, 5),
  },
  titleSupport: {
    fontSize: 20,
    lineHeight: 1,
    fontWeight: 300,
    color: theme.colors.primary,
    margin: theme.spacing(7, 2, 4),
  },
  label: {
    fontSize: 16,
    lineHeight: 1.3,
    fontWeight: 700,
    color: theme.colors.text,
  },
  subLabel: {
    padding: theme.spacing(0, 0, 1),
    fontSize: 15,
    lineHeight: 1,
    color: theme.colors.text + '80',
    textAlign: 'center',
  },
  discordButton: {
    backgroundColor: '#5865F2',
    margin: theme.spacing(1),
    borderRadius: 8,
    fontSize: 15,
    textAlign: 'center',
    height: '100%',
  },
}));

export const SummonCirclePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { address: myAddress, myUsers } = useMyProfile();
  const { selectCircle } = useApiBase();

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
      <div className={classes.root}>
        <h2 className={classes.title}>
          Connect your wallet to create a circle.
        </h2>
      </div>
    );
  }

  const org = protocols.find(p => p.id === Number(params.get('org')));
  const source = { protocol_id: org?.id, protocol_name: org?.name };

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>Create a Circle</h2>
      <CreateCircleForm.FormController
        source={source}
        submit={async ({ ...params }) => {
          try {
            const newCircle = await createCircle({ ...params });
            await selectCircle(newCircle.id);
            navigate({
              pathname: paths.paths.adminCircles,
              search: paths.NEW_CIRCLE_CREATED_PARAMS,
            });
          } catch (e) {
            console.warn(e);
          }
        }}
      >
        {({ fields, changedOutput, handleSubmit }) => (
          <div className={classes.bodyInner}>
            <div className={classes.subtitle}>
              Coordinape circles allow you to collectively reward circle members
              through equitable and transparent payments. To start a circle, we
              need just a bit of information.
            </div>
            <div className={classes.twoColumnGrid}>
              <FormTextField {...fields.user_name} label="Username" fullWidth />
              <ApeTextField
                label="ETH Address"
                value={myAddress}
                disabled
                fullWidth
                infoTooltip="Uses the address of your connected wallet"
              />
              <FormTextField
                {...fields.circle_name}
                label="Circle Name"
                fullWidth
              />
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
                  label="Organization Name"
                  fullWidth
                  TextFieldProps={{
                    infoTooltip: (
                      <>
                        Circles nest within Organizations.
                        <br />
                        <br />
                        Example:
                        <br />
                        Org Name - Coordinape
                        <br />
                        Circle Name - Design Team
                      </>
                    ),
                  }}
                />
              ) : (
                <FormTextField
                  {...fields.protocol_name}
                  label="Organization Name"
                  fullWidth
                  infoTooltip="A circle admin can add to an existing organization."
                />
              )}
            </div>
            <div className={classes.titleSupport}>Coordinape Support</div>
            <div className={classes.twoColumnGrid}>
              <FormTextField
                {...fields.contact}
                fullWidth
                label="Circle Point of Contact"
                placeholder="Discord #0000, Telegram, Twitter or Email "
                subtitle="We use this as follow-up & support"
              />
              <div className={classes.root}>
                <div className={classes.label}>Need More Help?</div>
                <div className={classes.subLabel}>
                  Join Our Discord for Information & Support
                </div>
                <Button
                  className={classes.discordButton}
                  variant="contained"
                  disableElevation
                  startIcon={<DiscordIcon />}
                  fullWidth
                  target="_blank"
                  rel="noreferrer"
                  href={paths.EXTERNAL_URL_DISCORD_SUPPORT}
                >
                  Join Coordinape Discord
                </Button>
              </div>
            </div>
            <Button
              className={classes.saveButton}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!changedOutput}
            >
              Launch this Circle
            </Button>
          </div>
        )}
      </CreateCircleForm.FormController>
    </div>
  );
};

export default SummonCirclePage;
