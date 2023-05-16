import { obfuscateId } from '.';

test('id obfuscation', () => {
  expect(obfuscateId('5315')).toEqual(
    'uNq4oJh/rA2/BySRvvm78T0JwS8LwdsLOdYB8V5p4T0='
  );
});
