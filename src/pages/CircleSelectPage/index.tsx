import { Button, makeStyles } from '@material-ui/core';
import { LoadingModal } from 'components';
import { MAX_GIVE_TOKENS } from 'config/constants';
import { useConnectedWeb3Context } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { ICircle, IUser } from 'types';
import { subdomainAddress } from 'utils/domain';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 70,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '60%',
    textAlign: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    padding: theme.spacing(0, 5),
    fontSize: 30,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  circleLabel: {
    marginTop: theme.spacing(5.5),
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing(1.5),
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center',
    color: theme.colors.border,
    border: 'solid',
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: theme.colors.border,
  },
  circleContainer: {
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: theme.spacing(20),
    width: '70%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    border: 'solid',
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: theme.colors.border,
  },
  circle: {
    margin: theme.spacing(2),
    width: 230,
    height: 230,
    borderRadius: 115,
    background: theme.colors.background,
    textTransform: 'none',
  },
  circleContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  circleTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
    color: theme.colors.secondary,
  },
  circleDescription: {
    margin: 0,
    fontSize: 13,
    fontWeight: 400,
    textAlign: 'center',
    color: theme.colors.text,
  },
}));

const CircleSelectPage = () => {
  const classes = useStyles();
  const { account } = useConnectedWeb3Context();
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [myCircles, setMyCircles] = useState<ICircle[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  // Get Circles & Users
  useEffect(() => {
    if (account) {
      const getCircles = async () => {
        try {
          const circles = await getApiService().getCircles();
          setCircles(circles);
        } catch (error) {
          enqueueSnackbar(
            error.response?.data?.message || 'Something went wrong!',
            { variant: 'error' }
          );
        }
      };

      const getUsers = async () => {
        try {
          const users = await getApiService().getUsers(account);
          setUsers(users);
        } catch (error) {
          enqueueSnackbar(
            error.response?.data?.message || 'Something went wrong!',
            { variant: 'error' }
          );
        }
      };

      const queryData = async () => {
        setLoading(true);
        await getCircles();
        await getUsers();
        setLoading(false);
      };

      queryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  // Get My Circles
  useEffect(() => {
    if (circles) {
      setMyCircles(
        circles.filter((circle) =>
          users.some((user) => user.circle_id === circle.id)
        )
      );
    } else {
      setMyCircles([]);
    }
  }, [circles, users]);

  // Return
  return (
    <div className={classes.root}>
      {myCircles.length > 0 ? (
        <>
          <div className={classes.headerContainer}>
            <p className={classes.title}>Welcome back!</p>
            <p className={classes.subTitle}>
              Select the teammates you’ve been working with and allocate GIVE in
              each of your{' '}
              {myCircles.length > 1
                ? `${myCircles.length} circles`
                : '1 circle'}
            </p>
          </div>
          <p className={classes.circleLabel}>Your Circles</p>
          <div className={classes.circleContainer}>
            {myCircles.map((circle) => (
              <Button
                className={classes.circle}
                href={subdomainAddress(circle.name)}
                key={circle.id}
                target="_blank"
              >
                <div className={classes.circleContent}>
                  <p className={classes.circleTitle}>
                    {circle.name.charAt(0).toUpperCase() + circle.name.slice(1)}
                  </p>
                  <p className={classes.circleDescription}>
                    {MAX_GIVE_TOKENS -
                      (users.find((user) => user.circle_id === circle.id)
                        ?.give_token_remaining || MAX_GIVE_TOKENS)}{' '}
                    GIVE ALLOCATED
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </>
      ) : (
        !isLoading && (
          <div className={classes.headerContainer}>
            <p className={classes.title}>Oops! :(</p>
            <p className={classes.subTitle}>
              Sorry, you have no authorized Circles
            </p>
          </div>
        )
      )}
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </div>
  );
};

export default CircleSelectPage;
