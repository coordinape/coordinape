import { saveAllSouls } from '../src/features/cosoul/orphanedSouls';

saveAllSouls().then(() => {
  console.log('done');
});
