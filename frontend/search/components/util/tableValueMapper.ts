export type Array2StringTransformOptions = {
  join?: string
}

export type ColumnOptions = {
  transform?: {
    array2string?: Array2StringTransformOptions
  }
}

const array2string = (value: string[], options: Array2StringTransformOptions) => value.join(options.join || ',')

export type ColumnRaw = {
  name: string;
  header: string;
  type: string;
  editable?: boolean;
  options?: ColumnOptions }

export const transformValue = <T>(values: T, columnsRaw: ColumnRaw[]) => {
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
