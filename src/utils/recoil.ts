/**
 * Use with recoil to suspend until state is initialized.
 */
export const neverEndingPromise = <T>() => new Promise<T>(() => void 0);
