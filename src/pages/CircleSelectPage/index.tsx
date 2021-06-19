import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useSnackbar } from 'notistack';

import { Button, makeStyles } from '@material-ui/core';

import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { getApiService } from 'services/api';
import { API_URL, getCirclePath } from 'utils/domain';
import { getCircleId, setCircleId } from 'utils/storage';

import { ICircle, IUser } from 'types';

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
    width: 250,
    height: 250,
    borderRadius: 125,
    background: theme.colors.background,
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
    lineHeight: 1.5,
    color: theme.colors.secondary,
  },
  circleDescription: {
    margin: theme.spacing(2, 0),
    fontSize: 13,
    fontWeight: 400,
    textAlign: 'center',
    color: theme.colors.text,
  },
}));

const CircleSelectPage = () => {
  const classes = useStyles();
  const { account } = useConnectedWeb3Context();
  const { setCircle } = useUserInfo();
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

      axios.defaults.baseURL = API_URL;
      setCircle(null);
      queryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  // Get My Circles
  useEffect(() => {
    if (circles) {
      const myCircles = users.some((user) => user.admin_view !== 0)
        ? circles
        : circles.filter((circle) =>
            users.some((user) => user.circle_id === circle.id)
          );
      setMyCircles(myCircles);

      const circle_id = getCircleId();
      const prevCircle = myCircles.find((circle) => circle.id === circle_id);
      if (prevCircle) {
        axios.defaults.baseURL = getCirclePath(prevCircle.id);
        setCircle(prevCircle);
      }
    } else {
      setMyCircles([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circles, users]);

  const findCircleUserAllocatedTokens = (circleId: number) => {
    const user = users.find((user) => user.circle_id === circleId);
    if (user) {
      return user.starting_tokens - user.give_token_remaining;
    }
    return 0;
  };

  // Return
  return (
    <div className={classes.root}>
      {myCircles.length > 0 ? (
        <>
          <div className={classes.headerContainer}>
            <p className={classes.title}>Welcome back!</p>
            <p className={classes.subTitle}>
              {myCircles.length > 1
                ? `Select the teammates you’ve been working with and allocate ${myCircles.reduce(
                    (tokens, circle) =>
                      tokens.length === 0
                        ? circle.token_name
                        : `${tokens}/${circle.token_name}`,
                    ''
                  )} in each of your ${myCircles.length} circles`
                : `Select the teammates you’ve been working with and allocate ${myCircles.reduce(
                    (tokens, circle) =>
                      tokens.length === 0
                        ? circle.token_name
                        : `${tokens}/${circle.token_name}`,
                    ''
                  )}`}
            </p>
          </div>
          <p className={classes.circleLabel}>Your Circles</p>
          <div className={classes.circleContainer}>
            {myCircles.map((circle) => (
              <Button
                className={classes.circle}
                key={circle.id}
                onClick={() => {
                  axios.defaults.baseURL = getCirclePath(circle.id);
                  setCircle(circle);
                  setCircleId(circle.id);
                }}
              >
                <div className={classes.circleContent}>
                  <p className={classes.circleTitle}>
                    {circle.protocol.name} / {circle.name}
                  </p>
                  <p className={classes.circleDescription}>
                    {findCircleUserAllocatedTokens(circle.id)}{' '}
                    {circle.token_name} ALLOCATED
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
