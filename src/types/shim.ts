// TODO: delete this file after we upgrade to TypeScript 4.5
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
