import { ClaimCard } from 'components/ClaimCard/ClaimCard';
import { Button } from 'ui';
import PopOver from 'ui/Popover';

export const Claims = () => {
  const banklessEpochInfo = [
    {
      title: 'Marketing Circle: E3',
      subTitle: 'Bankless DAO',
      giveInfo: 'You Received 25 GIVE',
    },
    {
      title: 'Core Contributors',
      subTitle: 'Coordinape',
      giveInfo: 'You Received 100 GIVE',
    },
  ];

  const epochInfo = [
    {
      title: 'Core Contributors: E2',
      subTitle: 'Coordinape',
      giveInfo: 'You Received 125 GIVE',
    },
    {
      title: 'Core Contributors: E4',
      subTitle: 'Coordinape',
      giveInfo: 'You Received 100 GIVE',
    },
  ];

  const claimsByCircle = [banklessEpochInfo, epochInfo];

  const trigger = <Button variant={'claimFunds'}>Claim Funds</Button>;

  const content = (
    <>
      <Button
        css={{
          marginTop: '$md',
          width: '100%',
          '&:hover': {
            backgroundColor: '$red',
            color: 'white',
          },
        }}
        outlined
        size="small"
        color="red"
      >
        Claim All Funds
      </Button>
      {claimsByCircle.map((epochInfo, index) => (
        <ClaimCard
          key={index}
          epochInfo={epochInfo}
          claimAmount="2500"
          symbol="USDC"
        />
      ))}
    </>
  );

  return (
    <>
      <PopOver trigger={trigger} content={content} showClose />
    </>
  );
};
