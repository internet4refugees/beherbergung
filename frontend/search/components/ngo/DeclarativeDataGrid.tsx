import React, {ReactNode, useCallback, useEffect, useRef, useState} from 'react'

import {CheckBoxOutlineBlank, CheckBox} from '@mui/icons-material'

import '@inovua/reactdatagrid-community/index.css'

import DataGrid from '@inovua/reactdatagrid-community'
import {
  TypeColumn,
  TypeComputedProps, TypeDataGridProps,
  TypeFilterValue,
  TypeSingleFilterValue
} from "@inovua/reactdatagrid-community/types"
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import StringFilter from '@inovua/reactdatagrid-community/StringFilter'
import BoolFilter from '@inovua/reactdatagrid-community/BoolFilter'
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter"
import BoolEditor from '@inovua/reactdatagrid-community/BoolEditor'
import moment from "moment"

import {ColumnRaw} from '../util/datagrid/columnRaw'
import {transformValue} from "../util/tableValueMapper";
import {filterUndefOrNull} from "../util/notEmpty";
import extendedFilter from "../util/datagrid/extendedFilter";
import {TypeOnSelectionChangeArg} from "@inovua/reactdatagrid-community/types/TypeDataGridProps";
import {TypeColumns} from "@inovua/reactdatagrid-community/types/TypeColumn";

global.moment = moment


export type DeclarativeDataGridProps<T extends { [k: string]: any }> = {
  data?: T[]
  onFilteredDataChange?: (data: T[]) => void
  columnsRaw: ColumnRaw[]
  firstColumns?: TypeColumns
  onRowSelect?: (id: string) => void
  selectedId?: string | null
} & Partial<TypeDataGridProps>

const filterMappings = {
  string: StringFilter,
  boolean: BoolFilter,
  number: NumberFilter,
  date: DateFilter,
}
const editorMappings = {
  boolean: BoolEditor
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

function Email({value}: { value: string }) {
  const href = `mailto:${value}`
  return <a href={href}>{value}</a>
}

function Phone({value}: { value: string }) {
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

const findMatchingRenderer = (c: Partial<ColumnRaw>) =>
  customRendererForType.find(d =>
    Object.keys(d.match)
      .reduce<boolean>((prev, cur) => prev && (c as any)[cur] === d.match[cur], true))
    ?.render


const columns = (columnsRaw: ColumnRaw[], firstColumns?: TypeColumns) => ([
  ...firstColumns,
  ...columnsRaw
    .map(c => ({
      ...c,
      render: findMatchingRenderer(c) || undefined,
      filterEditor: filterMappings[c.type as 'string' | 'number' | 'boolean' | 'date'],
      editor: editorMappings[c.type as 'boolean']
    }))])


function defaultFilterValue(columnsRaw: ColumnRaw[]) {
  return columnsRaw
    .filter(({type}) => type && ['string', 'number', 'boolean', 'date'].includes(type))
    .map(({name, type, options}) => {
      return {
        name,
        type,
        value: null,
        operator: options?.filter?.operator || operatorsForType[type as 'string' | 'number' | 'date' | 'boolean']
      } as unknown as TypeSingleFilterValue
    })
}

const DeclarativeDataGrid = <T, >({
                                    data,
                                    onFilteredDataChange,
                                    columnsRaw,
                                    onRowSelect,
                                    selectedId,
                                    firstColumns,
                                    ...props
                                  }: DeclarativeDataGridProps<T>) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [filterValue, setFilterValue] = useState<TypeFilterValue | undefined>(defaultFilterValue(columnsRaw));

  const filterValueChangeHandler = useCallback((_filterValue?: TypeFilterValue) => {
    setFilterValue(_filterValue);
  }, [setFilterValue])

  const filterAndSetData = useCallback(() => {
    if (!filterValue) {
      setFilteredData(dataSource)
      onFilteredDataChange && onFilteredDataChange(dataSource)
      return
    }
    const data = extendedFilter(dataSource, filterValue, columnsRaw)
    onFilteredDataChange && onFilteredDataChange(data)
    setFilteredData(data)
  }, [columnsRaw, dataSource, onFilteredDataChange, setFilteredData, filterValue])

  useEffect(() => {
    filterAndSetData()
  }, [columnsRaw, dataSource, filterValue, filterAndSetData]);

  useEffect(() => {
    if (!data) return
    const _data = filterUndefOrNull(data)
      .map(v => transformValue(v, columnsRaw))

    _data && setDataSource(_data)
  }, [columnsRaw, data])

  const gridRef = useRef<TypeComputedProps | null>(null);
  const scrollTo = useCallback((id: string) => {
    gridRef.current?.scrollToId(id, {duration: 300})
  }, [gridRef])

  const debugPrint = useCallback((selectedId) => {
    console.log(data.filter(d => (d as any).id === selectedId))
  }, [selectedId, data])

  useEffect(() => {
    selectedId && scrollTo(selectedId)
    selectedId && debugPrint(selectedId)  // TODO: only when debug option is checked in menu
  }, [selectedId, scrollTo, debugPrint]);

  const handleRowSelect = useCallback(({selected}: TypeOnSelectionChangeArg) => {
    typeof selected === 'string' && onRowSelect && onRowSelect(selected)
  }, [onRowSelect])

  return <DataGrid
    idProperty="id"
    filterable
    onReady={(computedPropsRef) => gridRef.current = computedPropsRef.current}
    showColumnMenuFilterOptions={true}
    showFilteringMenuItems={true}
    filterValue={filterValue}
    onFilterValueChange={filterValueChangeHandler}
    rowIndexColumn
    enableColumnAutosize={false}
    columns={columns(columnsRaw, firstColumns)}
    dataSource={filteredData}
    style={{height: '100%'}}
    selected={selectedId}
    onSelectionChange={handleRowSelect}
    {...props}
  />
}

export default DeclarativeDataGrid
