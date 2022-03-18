import {
  Array2StringTransformOptions,
  DateToISOTransformOptions,
} from "../tableValueMapper";

export type ColumnOptions = {
  dateFormat?: string;
  filter?: {
    operator?: string;
  };
  transform?: {
    array2string?: Array2StringTransformOptions;
    date2Iso?: DateToISOTransformOptions;
  };
};
export interface ColumnRaw {
  name: string;
  header: string;
  type: string;
  editable?: boolean;
  defaultWidth?: number;
  group?: string;
  options?: ColumnOptions;
}
