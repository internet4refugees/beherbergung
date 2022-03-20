import { ColumnRaw } from "./datagrid/columnRaw";
import moment from "moment";

export type Array2StringTransformOptions = {
  join?: string;
};

export type DateToISOTransformOptions = {
  inputDateFormat?: string;
  outputDateFormat?: string;
};

const array2string = (value: string[], options: Array2StringTransformOptions) =>
  value.join(options.join || " ");

const callOneOrMany: <T, O>(
  els: T | T[],
  cb: (d: T, ...rest: any[]) => O,
  args?: any[]
) => O | O[] = (els, cb, args = []) =>
  Array.isArray(els) ? els.map((v) => cb(v, ...args)) : cb(els, ...args);

const dateToIso: (date: string, options: DateToISOTransformOptions) => string =
  (date, { inputDateFormat, outputDateFormat }) =>
    moment(date, inputDateFormat).format(outputDateFormat);

export const transformValue: <T>(values: T, columnsRaw: ColumnRaw[]) => T = (
  values,
  columnsRaw
) => {
  const newValues = { ...values };
  columnsRaw.forEach((c) => {
    const transform = c.options?.transform;
    if (!transform) return;
    // @ts-ignore
    let value = values[c.name];
    if (!value) return;
    if (transform.date2Iso?.inputDateFormat) {
      value = callOneOrMany(value, dateToIso, [transform.date2Iso]);
    }
    if (transform.array2string && Array.isArray(value)) {
      try {
        // @ts-ignore
        newValues[c.name] = array2string(value, transform.array2string);
      } catch (e) {
        console.error("cannot transform");
      }
    }
  });
  return newValues;
};
