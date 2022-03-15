import React, {ReactNode, useCallback, useEffect, useState} from 'react'

import {CheckBoxOutlineBlank, CheckBox} from '@mui/icons-material'

import '@inovua/reactdatagrid-community/index.css'

import DataGrid from '@inovua/reactdatagrid-community'
import filter from '@inovua/reactdatagrid-community/filter'
import {TypeColumn, TypeFilterValue, TypeSingleFilterValue} from "@inovua/reactdatagrid-community/types"
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import StringFilter from '@inovua/reactdatagrid-community/StringFilter'
import BoolFilter from '@inovua/reactdatagrid-community/BoolFilter'
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter"
import BoolEditor from '@inovua/reactdatagrid-community/BoolEditor'
import { GetOffersQuery, GetRwQuery} from "../../codegen/generates"
import moment from "moment"

import {useTranslation} from "react-i18next"
import {resources} from '../../i18n/config'

import { fetcher } from '../../codegen/fetcher'
import { useAuthStore, AuthState } from '../Login'
import defaultColumnRawDefinition from "../config/defaultColumnRawDefinition";
import defaultColumnGroups from "../config/defaultColumnGroups";
import { ColumnRaw } from '../util/datagrid/columnRaw'
import columnsRaw from "../config/defaultColumnRawDefinition";
import {transformValue} from "../util/tableValueMapper";
import {filterUndefOrNull} from "../util/notEmpty";

global.moment = moment

export type HostOfferLookupTableDataType = GetOffersQuery["get_offers"] & GetRwQuery["get_rw"];
export type HostOfferLookupTableProps = {
  data_ro?: GetOffersQuery["get_offers"],
  data_rw?: GetRwQuery["get_rw"],  // TODO
  refetch_rw: any,
  onFilteredDataChange?: (data: HostOfferLookupTableDataType[]) => void
}

const filterMappings = {
  string: StringFilter,
  boolean: BoolFilter,
  number: NumberFilter,
  date: DateFilter,
}
const editorMappings = {
  string: null,
  boolean: BoolEditor,
  number: null,
  date: null
}
const operatorsForType = {
  number: 'gte',
  string: 'contains',
  date: 'beforeOrOn',
  boolean: 'eq',
}

type CustomRendererMatcher = {
  match: { [key: string]: any }
  render: (...args: any[]) => ReactNode
}

function Email({value}: {value: string}) {
  const href = `mailto:${value}`
  return <a href={href}>{value}</a>
}

function Phone({value}: {value: string}) {
  const href = `tel:${value}`
  return <a href={href}>{value}</a>
}

const customRendererForType: CustomRendererMatcher[] = [
  {
    match: {type: 'boolean'},
    render: ({value}) => !!value ? <CheckBox/> : <CheckBoxOutlineBlank/>
  },
  {
    match: {type: 'string', name: 'contact_email'},
    render: Email
  },
  {
    match: {type: 'string', name: 'contact_phone'},
    render: Phone
  }
]

const findMatchingRenderer = (c: Partial<ColumnRaw>) => {
  const customRenderer = customRendererForType.find(d => {
    // @ts-ignore
    return Object.keys(d.match).reduce((prev, cur) => prev && c[cur] === d.match[cur], true)
  })
  return customRenderer?.render
}

const columns: TypeColumn[] = defaultColumnRawDefinition
  .map(c => ({
    ...c,
    render: findMatchingRenderer(c) || undefined,
    filterEditor: filterMappings[c.type as 'string' | 'number' | 'boolean' | 'date'],
    editor: editorMappings[c.type as 'string' | 'number' | 'boolean' | 'date']
  }))

const defaultFilterValue: TypeFilterValue = columns
  .filter(({type}) => type && ['string', 'number', 'date', 'boolean'].includes(type))
  .map(({name, type}) => {
    return {
      name,
      type,
      value: null,
      operator: operatorsForType[type as 'string' | 'number' | 'date' | 'boolean']
    } as unknown as TypeSingleFilterValue
  })

async function mutate(auth: AuthState, onEditComplete: {value: string, columnId: string, rowId: string}) {
  const type = typeof(onEditComplete.value)
  const onEditCompleteByType = {rowId: onEditComplete.rowId,
                                columnId: onEditComplete.columnId,
                                value_boolean: type === 'boolean' && onEditComplete.value || null,
                                value_string: type === 'string' && onEditComplete.value || null}
  const result = await fetcher<any, any>(`mutation WriteRW($auth: Auth!, $onEditCompleteByType: Boolean) {
                                            write_rw(auth: $auth, onEditCompleteByType: $onEditCompleteByType) }`,
                                         {auth, onEditCompleteByType})()
  return result?.write_rw
}

const rw_default = {rw_note: ''}  // Required for filtering 'Not empty'. TODO: Should be fixed in StringFilter

const HostOfferLookupTable = ({data_ro, data_rw, refetch_rw, onFilteredDataChange}: HostOfferLookupTableProps) => {
  const [dataSource, setDataSource] = useState<HostOfferLookupTableDataType[]>([]);
  const [filteredData, setFilteredData] = useState<HostOfferLookupTableDataType[]>([]);
  const [filterValue, setFilterValue] = useState(defaultFilterValue);

  const filterValueChangeHandler = useCallback((_filterValue) => {
    const data = filter(dataSource, filterValue)  as HostOfferLookupTableDataType[]
    setFilterValue(_filterValue);
    setFilteredData(data)
    onFilteredDataChange && onFilteredDataChange(data)
  }, [dataSource])


  useEffect(() => {
    // @ts-ignore
    const data = filterUndefOrNull( data_ro
      ?.map( e_ro => ({
          ...e_ro,
          ...((data_rw?.find((e_rw) => e_ro.id_tmp === e_rw.id || `rw_${e_ro.id}` === e_rw.id
			    ) || rw_default))}) ) || [])

    // @ts-ignore
    data && setDataSource(data)
    //setDataSource((/*data_rw?.get_rw || */ data_ro?.get_offers || []).map(v => transformValue(v, columnsRaw)))
  }, [data_ro, data_rw]);

  const auth = useAuthStore()

  const onEditComplete = useCallback(async ({value, columnId, rowId}) => {
    /** For now the easiest way to ensure the user can see if data was updated in the db is by calling `refetch_rw()`
        TODO: error handling **/
    await mutate(auth, {value, columnId, rowId}) && refetch_rw()
  }, [auth, refetch_rw])

  const {i18n: {language}} = useTranslation()
  // @ts-ignore
  const reactdatagridi18n = resources[language]?.translation?.reactdatagrid

  return <DataGrid
        idProperty="id"
        filterable
        showColumnMenuFilterOptions={true}
        showFilteringMenuItems={true}
        defaultFilterValue={defaultFilterValue}
        rowIndexColumn
        enableSelection
        enableColumnAutosize={false}
        columns={columns}
        dataSource={dataSource}
        i18n={reactdatagridi18n || undefined}
        style={{height: '100%'}}
	      onEditComplete={onEditComplete}
	      groups={defaultColumnGroups}
      />
}

export default HostOfferLookupTable
