import { Box } from '../../ui';
interface HistoryGiveCardProps {
  title: string;
  subTitle: string;
  giveInfo: string;
  onClaimClick(): void;
  onHistoryClick(): void;
}

export const HistoryGiveCard: React.FC<HistoryGiveCardProps> =
  (): JSX.Element => {
    return (
      <>
        <Box />
      </>
    );
  };
