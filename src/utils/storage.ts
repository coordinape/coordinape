const circleIdItem = 'circleId';

export const setCircleId = (id: number) => {
  localStorage.setItem(circleIdItem, String(id));
};

export const getCircleId = () => {
  const id = localStorage.getItem(circleIdItem);
  if (id) {
    return Number(id);
  }
  return -1;
};

export const removeCircleId = () => {
  localStorage.removeItem(circleIdItem);
};
