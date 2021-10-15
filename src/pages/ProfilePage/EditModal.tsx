import React from 'react';

type Props = {
  close: () => void;
  save: () => void;
  data: any;
  setData: (data: any) => void;
  isOpen: boolean;
};

export const EditModal = (props: Props) => {
  console.log(props);
  return <></>;
};
