import { obfuscateId, normalizePath } from '.';

test('obfuscate ids', () => {
  expect(obfuscateId('5315')).toEqual(
    'uNq4oJh/rA2/BySRvvm78T0JwS8LwdsLOdYB8V5p4T0='
  );
});

test('normalize paths', () => {
  expect(normalizePath('/bob/73/carol/18/woo/55')).toEqual(
    '/bob/:number/carol/:number/woo/:number'
  );

  expect(normalizePath('/join/ce8a1b28-e1e4-4bd8-8a01-520f709e1764')).toEqual(
    '/join/:token'
  );

  expect(
    normalizePath('/person/0xb9E325c71A11659a606791b8bF1847dff630cb9C/stuff')
  ).toEqual('/person/:address/stuff');
});
