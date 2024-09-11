import { coLinksPaths } from '../routes/paths';

import { GiveSkillLeaderboard } from './GiveSkillLeaderboard';

export const GiveSkillPage = () => {
  return <GiveSkillLeaderboard profileFunc={coLinksPaths.profileGive} />;
};
