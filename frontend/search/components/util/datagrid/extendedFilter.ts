import {
  TypeColumn,
  TypeSingleFilterValue,
} from "@inovua/reactdatagrid-community/types";
import filter from "@inovua/reactdatagrid-community/filter";
import moment from "moment";
import { ColumnRaw } from "./columnRaw";

const defaultDateFormat = "MM/DD/YYYY";
const extendedFilter: <T>(
  data: T[],
  filterValue: TypeSingleFilterValue[],
  columnsRaw: ColumnRaw[]
) => T[] = <T>(
  data: T[],
  filterValue: TypeSingleFilterValue[],
  columnsRaw: ColumnRaw[]
) => {
  const columns = columnsRaw
    .filter(({ type }) => type === "date")
    .reduce(
      (prev, cur) => ({
        ...prev,
        [cur.name]: {
          dateFormat: cur.options?.dateFormat || defaultDateFormat,
        },
      }),
      {}
    );
  return filter(
    data,
    filterValue.map((fV) => {
      if (typeof fV.value == "string" && fV.type === "date") {
        return {
          ...fV,
          value: moment(fV.value).format(defaultDateFormat),
        };
      }
      return fV;
    }),
    undefined,
    columns
  ) as T[];
};

export default extendedFilter;
