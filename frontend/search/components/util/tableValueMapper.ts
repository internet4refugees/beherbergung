import {ColumnRaw} from "./datagrid/columnRaw";

export type Array2StringTransformOptions = {
  join?: string
}


const array2string = (value: string[], options: Array2StringTransformOptions) => value.join(options.join || ',')

export const transformValue: <T>(values: T, columnsRaw: ColumnRaw[]) => T = (values, columnsRaw) => {
  const newValues = {...values}
  columnsRaw
    .forEach(c => {
      const transform = c.options?.transform
      if (!transform) return
      // @ts-ignore
      const value = values[c.name]
      if (!value) return
      if (transform.array2string) {
        try {
          // @ts-ignore
          newValues[c.name] = array2string(value, transform.array2string)
        } catch (e) {
          console.error('cannot transform')
        }
      }})
  return newValues
}
