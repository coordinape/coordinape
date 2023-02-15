import { isUserAdmin } from '../../lib/users';
import { CSS } from '../../stitches.config';
import { Text } from '../../ui';
import { useReceiveInfo } from 'pages/HistoryPage/useReceiveInfo';

export const NavCurrentCircleGiveCount = ({
  circleId,
  userId,
  role,
  css,
}: {
  circleId: number;
  userId: number;
  role: number;
  css?: CSS;
}) => {
  const { showGives, tokenName, visibleGive } = useReceiveInfo(
    circleId,
    userId
  );

  if (!showGives && !isUserAdmin({ role })) {
    return <></>;
  }

  return (
    <Text tag color="primary" css={css}>
      {visibleGive > 999 ? '999+' : visibleGive} {tokenName}
    </Text>
  );
};
