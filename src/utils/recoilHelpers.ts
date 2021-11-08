export const updaterMergeToIdMap = <V extends { id: number }>(
  newValue: V | V[],
  updateWith: (update: (oldValue: Map<number, V>) => Map<number, V>) => void
) => {
  updateWith((oldValue: Map<number, V>) => {
    const result = new Map(oldValue);
    if (Array.isArray(newValue)) {
      newValue.forEach(v => result.set(v.id, v));
    } else {
      result.set(newValue.id, newValue);
    }
    return result;
  });
};

export const updaterMergeToAddressMap = <V extends { address: string }>(
  newValue: V | V[],
  updateWith: (update: (oldValue: Map<string, V>) => Map<string, V>) => void
) => {
  updateWith((oldValue: Map<string, V>) => {
    const result = new Map(oldValue);
    if (Array.isArray(newValue)) {
      newValue.forEach(v => result.set(v.address, v));
    } else {
      result.set(newValue.address, newValue);
    }
    return result;
  });
};
