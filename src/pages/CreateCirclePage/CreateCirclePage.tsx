import { useMemo } from 'react';

import uniqBy from 'lodash/uniqBy';
import { useHistory } from 'react-router-dom';

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
import * as paths from 'routes/paths';

const useStyles = makeStyles((theme) => ({
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
}));

export const SummonCirclePage = () => {
  const classes = useStyles();
  const history = useHistory();

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
    // This page shouldn't be visible without an address.
    return <></>;
  }

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>Create a Circle</h2>
      <CreateCircleForm.FormController
        source={undefined}
        submit={async ({
          h_captcha_token,
          research_who,
          research_how_much,
          research_org_link,
          research_contact,
          ...params
        }) => {
          await createCircle(
            { ...params },
            h_captcha_token,
            JSON.stringify({
              address: myAddress,
              research_who,
              research_how_much,
              research_org_link,
              research_contact,
              ...params,
            })
          );
          history.push({
            pathname: paths.getAdminPath(),
            search: paths.NEW_CIRCLE_CREATED_PARAMS,
          });
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
                  fullWidth
                  TextFieldProps={{
                    infoTooltip:
                      'Add to organizations that you are an admin in or create a new org.',
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
            <div className={classes.sectionTitle}>
              Help our product team improve Coordinape:
            </div>
            <div className={classes.twoColumnGrid}>
              <FormTextField
                {...fields.research_who}
                fullWidth
                label="Who will you be adding to the circle?"
                placeholder="Tell us about the people you’re working with"
              />
              <FormTextField
                {...fields.research_how_much}
                label="How much will be distributed each month?"
                placeholder="Approximate value of assets sent through circle"
                fullWidth
              />
            </div>
            <FormHCaptcha {...fields.h_captcha_token} error={false} />
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
