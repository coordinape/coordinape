const STORAGE_KEY_FORCE_OPT_OUT_CIRCLE_ID_ITEM = 'forceOptOutCircleId';
const STORAGE_KEY_CIRCLE_ID = 'circleId';

export default {
  setCircleId: (id: number) =>
    localStorage.setItem(STORAGE_KEY_CIRCLE_ID, String(id)),
  getCircleId: () => Number(localStorage.getItem(STORAGE_KEY_CIRCLE_ID) ?? -1),
  clearCircleId: () => localStorage.removeItem(STORAGE_KEY_CIRCLE_ID),
  addForceOptOutCircleId: (userId: number, circleId: number) => {
    const key = `${STORAGE_KEY_FORCE_OPT_OUT_CIRCLE_ID_ITEM}+${userId}`;
    const all = JSON.parse(localStorage.getItem(key) || '[]') || [];
    all.push(circleId);
    localStorage.setItem(key, JSON.stringify(all));
  },
  isForceOptOutCircleId: (userId: number, circleId: number) => {
    const key = `${STORAGE_KEY_FORCE_OPT_OUT_CIRCLE_ID_ITEM}+${userId}`;
    const all = JSON.parse(localStorage.getItem(key) || '[]') || [];
    return all.some((element: any) => element === circleId);
  },
  removeForceOptOutCircleId: (userId: number, circleId: number) => {
    const key = `${STORAGE_KEY_FORCE_OPT_OUT_CIRCLE_ID_ITEM}+${userId}`;
    let all = JSON.parse(localStorage.getItem(key) || '[]') || [];
    all = all.filter((element: any) => element !== circleId);
    localStorage.setItem(key, JSON.stringify(all));
  },
};
