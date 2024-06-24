# Farcaster Data Dump Documentation

# 1.

Fids to get data for (anyone related to singer's fid):

```sql
SELECT
  DISTINCT fid
FROM
  farcaster.links
WHERE
  fid = 244292
  OR target_fid = 244292;
```

5623, 349079, 382051, 257018, 261557, 244292, 264093, 474426, 256854, 231173, 546419, 342384, 236454, 3854, 400913, 23041, 389267, 15207, 380810, 464235, 23353, 416485, 258989, 256384, 15566, 544959

#2 Get all data for these fids from the following tables:

## Get all casts for fids in set

Has complex data, need to export via COPY command:

psql --host "hasura-prod.cj5poe0vqq65.us-east-1.rds.amazonaws.com" --port "5432" --username "hasura" "postgres" -c "\copy (SELECT \* FROM farcaster.casts WHERE fid IN (5623, 349079, 382051, 257018, 261557, 244292, 264093, 474426, 256854, 231173, 546419, 342384, 236454, 3854, 400913, 23041, 389267, 15207, 380810, 464235, 23353, 416485, 258989, 256384, 15566, 544959)) TO '2024-06-24.farcaster.casts.csv' WITH CSV HEADER"

## Get all fids for fids in set

SELECT \* FROM
farcaster.fids
WHERE
fid IN (
5623,
349079,
382051,
257018,
261557,
244292,
264093,
474426,
256854,
231173,
546419,
342384,
236454,
3854,
400913,
23041,
389267,
15207,
380810,
464235,
23353,
416485,
258989,
256384,
15566,
544959
);

## Get all fnames for fids in set

SELECT

- FROM
  farcaster.fnames
  WHERE
  fid IN (
  5623,
  349079,
  382051,
  257018,
  261557,
  244292,
  264093,
  474426,
  256854,
  231173,
  546419,
  342384,
  236454,
  3854,
  400913,
  23041,
  389267,
  15207,
  380810,
  464235,
  23353,
  416485,
  258989,
  256384,
  15566,
  544959
  );

## Get all links for fids in set

SELECT

- FROM
  farcaster.links
  WHERE
  fid IN (
  5623,
  349079,
  382051,
  257018,
  261557,
  244292,
  264093,
  474426,
  256854,
  231173,
  546419,
  342384,
  236454,
  3854,
  400913,
  23041,
  389267,
  15207,
  380810,
  464235,
  23353,
  416485,
  258989,
  256384,
  15566,
  544959
  ) OR
  target_fid IN (
  5623,
  349079,
  382051,
  257018,
  261557,
  244292,
  264093,
  474426,
  256854,
  231173,
  546419,
  342384,
  236454,
  3854,
  400913,
  23041,
  389267,
  15207,
  380810,
  464235,
  23353,
  416485,
  258989,
  256384,
  15566,
  544959
  );

## Get all user_data for fids in set

SELECT

- FROM
  farcaster.user_data
  WHERE
  fid IN (
  5623,
  349079,
  382051,
  257018,
  261557,
  244292,
  264093,
  474426,
  256854,
  231173,
  546419,
  342384,
  236454,
  3854,
  400913,
  23041,
  389267,
  15207,
  380810,
  464235,
  23353,
  416485,
  258989,
  256384,
  15566,
  544959
  );

## Get all verifications for fids in set

SELECT

- FROM
  farcaster.verifications
  WHERE
  fid IN (
  5623,
  349079,
  382051,
  257018,
  261557,
  244292,
  264093,
  474426,
  256854,
  231173,
  546419,
  342384,
  236454,
  3854,
  400913,
  23041,
  389267,
  15207,
  380810,
  464235,
  23353,
  416485,
  258989,
  256384,
  15566,
  544959
  );
