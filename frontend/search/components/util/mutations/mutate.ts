import {fetcher} from "../../../codegen/fetcher";

export type OnEditCompleteVariables = { value: string, columnId: string, rowId: string }

export async function mutate(auth: { jwt: string }, onEditComplete: OnEditCompleteVariables ) {
  const type = typeof (onEditComplete.value)
  const onEditCompleteByType = {
    rowId: onEditComplete.rowId,
    columnId: onEditComplete.columnId,
    value_boolean: type === 'boolean' ? onEditComplete.value : null,
    value_string: type === 'string' ? onEditComplete.value : null
  }
  const result = await fetcher<any, any>(`mutation WriteRW($auth: Auth!, $onEditCompleteByType: Boolean) {
                                            write_rw(auth: $auth, onEditCompleteByType: $onEditCompleteByType) }`,
    {auth, onEditCompleteByType})()
  return result?.write_rw
}
