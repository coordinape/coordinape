import { ContributionForm2 } from './ContributionForm2';

export const PostForm2 = ({
  showLoading,
  onSave,
  onSuccess,
  refreshPrompt,
  label,
}: {
  showLoading?: boolean;
  onSave?: () => void;
  onSuccess?: () => void;
  refreshPrompt: () => void;
  label: React.ReactNode;
}) => {
  return (
    <ContributionForm2
      showLoading={showLoading}
      privateStream={true}
      placeholder={
        'Take inspiration from the prompt, or post whatever you want'
      }
      itemNounName={'Post'}
      showToolTip={false}
      onSave={onSave}
      onSuccess={onSuccess}
      refreshPrompt={refreshPrompt}
      label={label}
    />
  );
};
