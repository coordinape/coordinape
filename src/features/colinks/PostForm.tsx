import { ContributionForm2 } from './ContributionForm2';

export const PostForm = ({
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
      placeholder={
        'Take inspiration from the prompt, or post whatever you want'
      }
      onSave={onSave}
      onSuccess={onSuccess}
      refreshPrompt={refreshPrompt}
      label={label}
    />
  );
};
