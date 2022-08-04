import React, { useCallback, useState, useEffect } from 'react';

import * as mutations from 'lib/gql/mutations';

import {
  makeStyles,
  IconButton,
  Popper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  ListItemText,
  Checkbox,
} from '@material-ui/core';

import { ActionDialog } from 'components';
import { useCurrentCircleIntegrations } from 'hooks/gql/useCurrentCircleIntegrations';
import {
  DeprecatedDeleteIcon,
  DeworkIcon,
  DeworkLogo,
  ParcelIcon,
  WonderIcon,
  WonderLogo,
} from 'icons';
import { useSelectedCircle } from 'recoilState';
import { paths } from 'routes/paths';
import { Flex, Button, Box } from 'ui';

const useStyles = makeStyles(theme => ({
  errorColor: {
    color: theme.palette.error.main,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  integrationContainer: {
    marginBottom: theme.spacing(2),
  },
  integrationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  integrationText: {
    color: theme.colors.text,
    margin: 0,
    flex: 1,
  },
  integrationIcon: {
    color: theme.colors.text,
  },
  popper: {
    backgroundColor: 'white',
    borderStyle: 'solid',
    border: '1px',
    p: '1px',
    borderRadius: '5px',
    padding: '12px',
    marginBottom: '8px',
  },
  title: {
    marginBottom: '16px',
    fontWeight: 500,
    fontSize: '20px',
  },
}));

interface Org {
  name: string;
  description: string;
  id: string;
}

export const AdminIntegrations = ({ circleId }: { circleId: number }) => {
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [orgsUsed, setOrgsUsed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(previousOpen => !previousOpen);
  };

  const { myUser } = useSelectedCircle();

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const classes = useStyles();

  const integrations = useCurrentCircleIntegrations();
  const [deleteIntegration, setDeleteIntegration] =
    useState<Exclude<typeof integrations['data'], undefined>[number]>();

  const handleDeleteIntegration = useCallback(async () => {
    if (deleteIntegration) {
      await mutations.deleteCircleIntegration(deleteIntegration.id);
      await integrations.refetch();
      setDeleteIntegration(undefined);
    }
  }, [integrations.refetch, deleteIntegration]);

  const renderIntegrationLogo = (orgName: string): JSX.Element | null => {
    if (orgName === 'wonder') {
      return <WonderLogo size="md" className={classes.integrationIcon} />;
    } else if (orgName === 'dework') {
      return <DeworkLogo size="md" className={classes.integrationIcon} />;
    }
    return null;
  };

  const getUserOrgs = async () => {
    await fetch(`http://localhost:8001/v1/coordinape/orgs/${myUser.address}`, {
      headers: new Headers({
        Authorization: 'PPjXk7fvc2P7gU4dXGWnZsJo',
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(organizations => {
        setOrgs(organizations.data);
      });
  };

  const handleChosenOrgs = (name: string) => {
    const orgIndex = orgs.findIndex(org => org.name === name);
    if (orgsUsed.includes(orgs[orgIndex]?.id)) {
      const orgsUsedArray = orgsUsed.filter(
        orgId => orgId !== orgs[orgIndex]?.id
      );
      setOrgsUsed(orgsUsedArray);
    } else {
      const orgsUsedArray = orgsUsed;
      orgsUsedArray.push(orgs[orgIndex]?.id);
      setOrgsUsed(orgsUsedArray);
    }
  };

  useEffect(() => {
    getUserOrgs();
  }, []);

  return (
    <div style={{ display: 'grid' }}>
      <p className={classes.subTitle}>Integrations</p>
      <div className={classes.integrationContainer}>
        {integrations.data?.map((integration, index) => (
          <div key={index} className={classes.integrationRow}>
            {renderIntegrationLogo(integration.type)}
            <p className={classes.integrationText}>{integration.name}</p>
            <IconButton
              onClick={() => setDeleteIntegration(integration)}
              className={classes.errorColor}
              size="small"
            >
              <DeprecatedDeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
      {loading ? <Typography>Loading</Typography> : null}
      <Flex css={{ mr: '$sm' }} className={classes.integrationRow}>
        <Button
          as="a"
          color="neutral"
          size="medium"
          outlined
          onClick={handleClick}
        >
          <Flex css={{ mr: '$sm' }}>
            <WonderIcon size="md" />
          </Flex>
          Connect Wonder
        </Button>
        <Popper open={open} anchorEl={anchorEl} placement={'top'}>
          <Box className={classes.popper}>
            <Typography className={classes.title}>Pick orgs to add!</Typography>
            <FormControl style={{ width: 300, marginBottom: '16px' }}>
              <InputLabel
                style={{ paddingLeft: '16px' }}
                id="demo-multiple-name-label"
              >
                Orgs
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected: any) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {orgs
                  ? orgs.map((org: Org) => (
                      <MenuItem
                        onClick={() => {
                          handleChosenOrgs(org['name']);
                        }}
                        key={org['name']}
                        value={org['name']}
                      >
                        <Checkbox
                          checked={personName.indexOf(org['name']) > -1}
                        />
                        <ListItemText primary={org['name']} />
                      </MenuItem>
                    ))
                  : null}
              </Select>
            </FormControl>
            <Button
              fullWidth
              onClick={async () => {
                setLoading(true);
                setOpen(false);
                await mutations.createCircleIntegration(
                  circleId,
                  `wonder`,
                  `${personName} on Wonder`,
                  { organizationId: orgsUsed }
                );
                setLoading(false);
              }}
            >
              Save
            </Button>
          </Box>
        </Popper>
        <Button
          as="a"
          color="neutral"
          size="medium"
          outlined
          href={`https://app.dework.xyz/apps/install/coordinape?redirect=${
            window.location.origin
          }${paths.connectIntegration(circleId)}`}
        >
          <Flex css={{ mr: '$sm' }}>
            <DeworkIcon size="md" />
          </Flex>
          Connect Dework
        </Button>
        <Button
          as="a"
          color="neutral"
          size="medium"
          outlined
          href={
            'https://docs.coordinape.com/get-started/compensation/paying-your-team/parcel'
          }
        >
          <Flex css={{ mr: '$sm' }}>
            <ParcelIcon size="md" />
          </Flex>
          Pay with Parcel
        </Button>
      </Flex>

      <ActionDialog
        open={!!deleteIntegration}
        title={`Remove ${deleteIntegration?.name} from circle`}
        onClose={() => setDeleteIntegration(undefined)}
        primaryText="Remove Integration"
        onPrimary={deleteIntegration ? handleDeleteIntegration : undefined}
      />
    </div>
  );
};
