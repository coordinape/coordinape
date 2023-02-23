/* eslint-disable no-console */

/*
 * This is an example repl script. Use it as a copy for building a repl helper.
 * The general pattern of write some code in name_repair, start repl, run some functions,
 * debug by inspecting data in the repl, go back to editor when enough understanding
 * has accumulated to want to write more at length, repeat, is a useful model
 * for using the repl.
 */

import assert from 'assert';

import fp from 'lodash/fp';

import { adminClient as client } from '../../api-lib/gql/adminClient';

const getUsedNames = async (names: string[], verbose = false) => {
  const { profiles: dups } = await client.query(
    {
      profiles: [{ where: { name: { _in: names } } }, { name: true, id: true }],
    },
    { operationName: 'repl' }
  );
  if (verbose) console.log('names in use:', fp.map('name', dups));
  return dups;
};

const setupNextName = async (name: string) => {
  const existing = await client.query(
    {
      profiles: [{ where: { name: { _ilike: `${name}%` } } }, { name: true }],
    },
    { operationName: 'repl' }
  );
  const matches = existing.profiles
    .map(p => p.name.toLowerCase())
    .filter(n => n.match(new RegExp(`^${name.toLowerCase()}( \\d+)?$`, 'i')));

  let nameCounter = 0;

  const nextName = (): string => {
    const candidate = name.trim() + (nameCounter++ ? ` ${nameCounter}` : '');
    if (matches.includes(candidate.toLowerCase())) return nextName();
    return candidate;
  };

  return nextName;
};

const updateNames = async (
  rows: { id: number; name: string }[],
  autoIncrement = false,
  dryRun = false
) => {
  if (autoIncrement) {
    rows = await Promise.all(
      rows.map(async row => {
        const nextName = await setupNextName(row.name);
        const newName = nextName();
        if (newName === row.name) return row;

        console.log(`name change: ${row.name} => ${newName}`);
        return { ...row, name: newName };
      })
    );
  }

  const dups = await getUsedNames(fp.map('name', rows), true);
  rows = fp.differenceBy(x => x.name.toLowerCase(), rows, dups);
  if (rows.length === 0) return;

  if (rows.length > fp.uniqBy(x => x.name.toLowerCase(), rows).length) {
    console.log('found internal duplicates; stopping:');
    const names = rows.map(x => x.name.toLowerCase()).sort();
    names.forEach((name, i) => {
      if (i < names.length && name === names[i + 1]) console.log(name);
    });
    return;
  }

  const updates = fp.fromPairs(
    rows.map(({ id, name }, index) => [
      `row${index}`,
      {
        update_profiles_by_pk: [
          { pk_columns: { id }, _set: { name } },
          { id: true, name: true },
        ],
      },
    ])
  );

  if (dryRun) return updates;

  return client.mutate(
    // @ts-ignore
    { __alias: updates },
    { operationName: 'repl_updateProfile' }
  );
};

export async function init() {
  const { profiles } = await client.query(
    {
      profiles: [
        { where: { name: { _is_null: true } } },
        {
          id: true,
          address: true,
          users: [{}, { id: true, address: true, name: true }],
        },
      ],
    },
    { operationName: 'repl_profiles' }
  );
  console.log(profiles.length, 'unnamed profiles');

  const users = profiles
    .map(p => p.users.map(u => ({ ...u, profileId: p.id })))
    .flat();
  console.log(users.length, 'users');

  // same address, multiple names
  const overnamed = profiles.filter(
    p => p.users.length > 1 && fp.uniq(p.users.map(u => u.name)).length > 1
  );
  console.log(overnamed.length, 'over-named profiles');

  const others = fp.differenceBy('address', profiles, overnamed);

  const fixOvernamed = (address: string, verbose = false) => {
    const profile = profiles.find(p => p.address === address);
    assert(profile);
    const { users } = profile;
    const nameDistro = fp.flow(
      fp.groupBy('name'),
      fp.mapValues(v => v.length)
    )(users);
    if (verbose) console.log(address + ':', nameDistro);

    // pick most common
    if (users.length >= 3) {
      const max = Math.max(...Object.values(nameDistro));
      if (max > 1) {
        return fp.findKey(v => v === max, nameDistro);
      }
    }

    // try normalizing names
    const noDiscordId = users.map(u => u.name.replace(/\s*#\d+$/, ''));
    if (fp.uniq(noDiscordId).length === 1) {
      return noDiscordId[0];
    }

    const prefix = noDiscordId.find(x =>
      noDiscordId.every(y => y.toLowerCase().startsWith(x.toLowerCase()))
    );
    if (prefix) return prefix;

    // pick newest
    const newest = fp.maxBy('id', users);
    assert(newest);
    return newest.name;
  };

  const updateOvernamed = (count = 10) => {
    const rows = overnamed
      .slice(0, count)
      .map(p => {
        const name = fixOvernamed(p.address);
        if (!name) return;
        return { id: p.id, name };
      })
      .filter(x => x) as { id: number; name: string }[];

    const uniqRows = fp.flow(fp.sortBy('id'), fp.uniqBy('name'))(rows);
    console.log(
      `removing ${rows.length - uniqRows.length} internal duplicates:`,
      fp.differenceBy('id', rows, uniqRows)
    );
    return uniqRows;
  };

  // same name, multiple addresses

  const dupNames: Record<string, typeof users> = fp.flow(
    fp.groupBy((v: typeof users[0]) => v.name.toLowerCase()),
    fp.filter(v => v.length > 1),
    fp.filter(v => fp.uniqBy('address', v).length > 1),
    fp.map((v: typeof users) => [v[0].name, v]),
    fp.fromPairs
  )(users);
  console.log(fp.size(dupNames), 'duplicated names');

  const fixDupName = async (name: string, verbose = false) => {
    const users = dupNames[name];
    const nextName = await setupNextName(name);

    // order by lowest id;
    // give the name to the first;
    // append an incrementing number to the rest
    const renaming = fp.flow(
      fp.groupBy('address'),
      fp.toPairs,
      fp.map(([addr, us]) => {
        const min = Math.min(...fp.map('id', us));
        return [addr, us[0].profileId, us.length, min];
      }),
      fp.sortBy(v => v[3]),
      fp.map(v => [...v, nextName()])
    )(users);

    if (verbose)
      console.log(
        name + ':',
        renaming.map(([a, ...rest]) => [a.substring(0, 6), ...rest])
      );

    return renaming.map(r => ({ id: r[1], name: r[4] }));
  };

  const fixMe = async () => {
    const { profiles } = await client.query(
      {
        profiles: [
          { where: { name: { _ilike: 'Me %' } } },
          {
            id: true,
            name: true,
            users: [{}, { id: true, name: true }],
          },
        ],
      },
      { operationName: 'repl' }
    );

    return fp.flow(
      fp.map((p: typeof profiles[0]) => [
        p.id,
        fp.map('name', p.users).filter(n => n !== 'Me'),
      ]),
      fp.filter(r => r[1].length)
    )(profiles);
  };

  const fixOther = async (name: string) => {
    const nextName = await setupNextName(name);
    const matches = profiles.filter(p => p.users.some(u => u.name === name));
    assert(matches.length === 1, `not unique: ${name}`);
    return { id: matches[0].id, name: nextName() };
  };

  return {
    profiles,
    overnamed,
    others,
    getUsedNames,
    updateNames,
    fixOvernamed,
    updateOvernamed,
    dupNames,
    fixDupName,
    fixMe,
    fixOther,
  };
}
