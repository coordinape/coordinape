import { isUserAdmin } from '../../lib/users';
import { CSS } from '../../stitches.config';
import { Text } from '../../ui';
import { useReceiveInfo } from 'pages/HistoryPage/useReceiveInfo';

export const NavCurrentCircleGiveCount = ({
  circleId,
  user,
  css,
}: {
  circleId: number;
  user?: { id: number; role: number };
  css?: CSS;
}) => {
  const { showGives, tokenName, visibleGive } = useReceiveInfo(
    circleId,
    user?.id
  );

  if (!user || (!showGives && !isUserAdmin(user))) {
    return <></>;
  }

  return (
    <Text tag color="primary" css={css}>
      {visibleGive > 999 ? '999+' : visibleGive} {tokenName}
    </Text>
  );
};
