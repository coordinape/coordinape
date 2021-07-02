import React from 'react';

import { useRecoilValue } from 'recoil';

import { Button, makeStyles } from '@material-ui/core';

import { useCircle } from 'hooks';
import { rMyCircles } from 'recoilState';

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

  const myCircles = useRecoilValue(rMyCircles);
  const { selectAndFetchCircle } = useCircle();

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
                : `Select the teammates you’ve been working with and allocate ${myCircles[0].token_name}`}
            </p>
          </div>
          <p className={classes.circleLabel}>Your Circles</p>
          <div className={classes.circleContainer}>
            {myCircles.map((circle) => (
              <Button
                className={classes.circle}
                key={circle.id}
                onClick={() => {
                  selectAndFetchCircle(circle.id);
                }}
              >
                <div className={classes.circleContent}>
                  <p className={classes.circleTitle}>
                    {circle.protocol.name} / {circle.name}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className={classes.headerContainer}>
          <p className={classes.title}>Oops! :&#40;</p>
          <p className={classes.subTitle}>
            Sorry, you have no authorized Circles
          </p>
        </div>
      )}
    </div>
  );
};

export default CircleSelectPage;
