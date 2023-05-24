export type DateToString<T> = {
  [k in keyof T]: T[k] extends Date
    ? string
    : T[k] extends Date | null
    ? string | null
    : T[k] extends Date | undefined
    ? string | undefined
    : T[k] extends Date | null | undefined
    ? string | null | undefined
    : T[k];
};
