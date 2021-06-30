export const updaterMergeArrayToIdMap = (
  newValue: any[],
  updateWith: (update: (oldValue: any) => void) => void
) => {
  updateWith((oldValue: Map<number, any>) => {
    newValue.forEach((v) => oldValue.set(v.id, v));
    return new Map(oldValue);
  });
};

export const updaterMergeItemToIdMap = (
  newValue: any,
  updateWith: (update: (oldValue: any) => void) => void
) =>
  updateWith(
    (oldValue: Map<number, any>) => new Map(oldValue.set(newValue.id, newValue))
  );
