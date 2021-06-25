const circleIdItem = 'circleId';
const forceOptOutCircleIdItem = 'forceOptOutCircleId';

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

export const addForceOptOutCircleId = (userId: number, circleId: number) => {
  const key = `${forceOptOutCircleIdItem}+${userId}`;
  const all = JSON.parse(localStorage.getItem(key) || '[]') || [];
  all.push(circleId);
  localStorage.setItem(key, JSON.stringify(all));
};

export const isForceOptOutCircleId = (userId: number, circleId: number) => {
  const key = `${forceOptOutCircleIdItem}+${userId}`;
  const all = JSON.parse(localStorage.getItem(key) || '[]') || [];
  return all.some((element: any) => element === circleId);
};

export const removeForceOptOutCircleId = (userId: number, circleId: number) => {
  const key = `${forceOptOutCircleIdItem}+${userId}`;
  let all = JSON.parse(localStorage.getItem(key) || '[]') || [];
  all = all.filter((element: any) => element !== circleId);
  localStorage.setItem(key, JSON.stringify(all));
};
