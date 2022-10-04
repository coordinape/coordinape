import ContributionsPage from './ContributionsPage';

interface LinkedElement {
  next: () => LinkedElement;
  prev: () => LinkedElement;
  idx: number;
}

type Obj = Record<string, unknown>;

export function createLinkedArray<T extends Obj>(
  a: Array<T>
): Array<T & LinkedElement> {
  const newA: Array<T & LinkedElement> = Array(a.length);
  for (let i = 0; i < a.length; i++) {
    newA[i] = {
      ...a[i],
      idx: i,
      next: () => newA[i + 1],
      prev: () => newA[i - 1],
    };
  }
  return newA;
}
export default ContributionsPage;
