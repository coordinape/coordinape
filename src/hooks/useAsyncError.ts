import React from 'react';

export const useAsyncError = () => {
  const [_, setError] = React.useState();
  return React.useCallback(
    (e) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};
