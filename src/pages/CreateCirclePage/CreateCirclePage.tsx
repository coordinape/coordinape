import { useMemo } from 'react';

import uniqBy from 'lodash/uniqBy';

import { makeStyles, Button } from '@material-ui/core';

import {
  FormHCaptcha,
  FormTextField,
  ApeTextField,
  FormAutocomplete,
} from 'components';
import CreateCircleForm from 'forms/CreateCircleForm';
import { useApi } from 'hooks/useApi';
import { useMyAddress, useMyAdminCircles } from 'recoilState';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: theme.spacing(5, 2, 2),
  },
  bodyInner: {
    width: '100%',
    maxWidth: 850,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 4, 1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1, 1),
    },
  },
  subtitle: {
    color: theme.colors.primary,
    fontWeight: 400,
    size: 20,
    lineHeight: 1.5,
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  twoColumnGrid: {
    display: 'grid',
    width: '100%',
    maxWidth: 800,
    gridTemplateColumns: '1fr 1fr',
    gridAutoRows: '1fr',
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
      gridAutoRows: '1fr',
    },
  },
  sectionTitle: {
    color: theme.colors.primary,
    size: 20,
    lineHeight: 1,
    fontWeight: 400,
    margin: theme.spacing(6, 0, 0),
  },
  sectionSubtitle: {
    color: theme.colors.primary,
    textAlign: 'center',
    size: 10,
    lineHeight: 1.55,
    fontWeight: 300,
  },
  longform: {
    width: '100%',
    margin: theme.spacing(2, 0),
    maxWidth: 800,
    '& > *': {
      margin: theme.spacing(0, 0, 3),
    },
    '& label': {
      alignSelf: 'flex-start',
    },
  },
  saveButton: {
    margin: theme.spacing(3, 0, 5),
  },
  errors: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 0,
    minHeight: 45,
    color: theme.colors.red,
  },
}));

export const SummonCirclePage = () => {
  const classes = useStyles();
  const myAddress = useMyAddress();
  const myAdminCircles = useMyAdminCircles();

  const protocols = useMemo(
    () =>
      uniqBy(
        myAdminCircles.map(({ protocol }) => protocol),
        'id'
      ),
    [myAdminCircles]
  );

  const { createCircle } = useApi();

  if (myAddress === undefined) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>Create a Circle</h2>
      <CreateCircleForm.FormController
        source={undefined}
        hideFieldErrors
        submit={({
          h_captcha_token,
          research_what_needs,
          research_how_use,
          research_org_structure,
          research_org_link,
          research_org_ens,
          research_contact,
          ...params
        }) =>
          createCircle(
            { address: myAddress, ...params },
            h_captcha_token,
            JSON.stringify({
              address: myAddress,
              research_what_needs,
              research_how_use,
              research_org_structure,
              research_org_link,
              research_org_ens,
              research_contact,
              ...params,
            })
          )
        }
      >
        {({ fields, errors, changedOutput, handleSubmit }) => (
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
              />
              {myAdminCircles ? (
                <FormAutocomplete
                  {...fields.protocol_name}
                  value={fields.protocol_name.value}
                  onChange={(v: string) => {
                    const id = protocols.find((p) => p.name === v)?.id;
                    fields.protocol_id?.onChange(id);
                    fields.protocol_name.onChange(v);
                  }}
                  options={protocols.map((p) => p.name)}
                  label="Organization Name"
                  helperText="Select from list to add to existing org."
                  fullWidth
                />
              ) : (
                <FormTextField
                  {...fields.protocol_name}
                  label="Organization Name"
                  fullWidth
                />
              )}
              <FormTextField
                {...fields.circle_name}
                label="Circle Name"
                fullWidth
              />
            </div>
            <h3 className={classes.sectionTitle}>Optional Fields</h3>
            <div className={classes.sectionSubtitle}>
              Help our product team improve coordinape
            </div>

            <div className={classes.longform}>
              <FormTextField
                label="What compensation needs does your organization have?"
                {...fields.research_what_needs}
                multiline
                fullWidth
                rows={3}
              />
              <FormTextField
                label="How do you want to use Coordinape?"
                {...fields.research_how_use}
                multiline
                fullWidth
                rows={3}
              />
              <FormTextField
                label="How is your organization structured and how many people are involved?"
                {...fields.research_org_structure}
                multiline
                fullWidth
                rows={3}
              />
            </div>

            <div className={classes.twoColumnGrid}>
              <FormTextField
                {...fields.research_contact}
                fullWidth
                label="How we can contact you?"
              />
              <FormTextField
                {...fields.research_org_link}
                label="Web link"
                fullWidth
              />
              <FormTextField
                {...fields.research_org_ens}
                label="Snapshot ENS"
                fullWidth
              />
            </div>
            <FormHCaptcha {...fields.h_captcha_token} />
            {!!errors && (
              <div className={classes.errors}>
                {Object.values(errors).map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </div>
            )}
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
