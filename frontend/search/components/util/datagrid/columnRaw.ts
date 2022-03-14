import {Array2StringTransformOptions} from "../tableValueMapper";

export type ColumnOptions = {
  transform?: {
    array2string?: Array2StringTransformOptions
  }
}
export interface ColumnRaw {
  name: string;
  header: string;
  type: string;
  editable?: boolean;
  defaultWidth?: number;
  group?: string;
  options?: ColumnOptions
}


