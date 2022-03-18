/**
 * filter out nullish values
 * https://stackoverflow.com/a/46700791/2726641
 * @param value
 */
const isUndefOrEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => !(value === null || value === undefined);

export const filterUndefOrNull = <T>(
  ts?: (T | undefined | null)[] | null
): T[] =>
  ts?.filter(
    (t: T | undefined | null): t is T => t !== undefined && t !== null
  ) || [];

export default isUndefOrEmpty;
