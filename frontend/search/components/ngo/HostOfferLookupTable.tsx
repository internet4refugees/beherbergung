import React, {ReactNode} from 'react'

import {CheckBoxOutlineBlank, CheckBox} from '@mui/icons-material';

import '@inovua/reactdatagrid-community/index.css'

import DataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import StringFilter from '@inovua/reactdatagrid-community/StringFilter'
import BoolFilter from '@inovua/reactdatagrid-community/BoolFilter'
import {GetOffersQuery} from "../../codegen/generates";
import {TypeColumn, TypeFilterValue, TypeSingleFilterValue} from "@inovua/reactdatagrid-community/types";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import moment from "moment";

import {useTranslation} from "react-i18next";
import {resources} from '../../i18n/config';
import {Box} from "@mui/material";

global.moment = moment

type HostOfferLookupTableProps = {
  data: GetOffersQuery
}

type ColumnRaw = { name: string; header: string; type: string }

/**
 * you can generate an inital raw column json by running the following
 * function
 */
const makeColumnDefinition = (data: any) => Object.keys(data)
  .map(k => ({
    name: k,
    header: k.replace(/_/g, ' '),
    type: typeof data[k]
  }))

const columnsRaw: ColumnRaw[] = [
  {
    "name": "place_country",
    "header": "place country",
    "type": "string"
  },
  {
    "name": "place_city",
    "header": "place city",
    "type": "string"
  },
  {
    "name": "beds",
    "header": "beds",
    "type": "number"
  },
  {
    "name": "time_from_str",
    "header": "time from str",
    "type": "date"
  },
  {
    "name": "time_duration_str",
    "header": "time duration str",
    "type": "string"
  },
  {
    "name": "languages",
    "header": "languages",
    "type": "object"
  },
  {
    "name": "accessible",
    "header": "accessible",
    "type": "boolean"
  },
  {
    "name": "animals_allowed",
    "header": "animals allowed",
    "type": "boolean"
  },
  {
    "name": "animals_present",
    "header": "animals present",
    "type": "boolean"
  },
  {
    "name": "note",
    "header": "note",
    "type": "string"
  },
  {
    "name": "contact_name_full",
    "header": "contact name full",
    "type": "string"
  },
  {
    "name": "contact_phone",
    "header": "contact phone",
    "type": "string"
  },
  {
    "name": "contact_email",
    "header": "contact email",
    "type": "string"
  },
  {
    "name": "place_street",
    "header": "place street",
    "type": "string"
  },
  {
    "name": "place_street_number",
    "header": "place street number",
    "type": "string"
  },
  {
    "name": "place_zip",
    "header": "place zip",
    "type": "string"
  },
]

const filterMappings = {
  string: StringFilter,
  boolean: BoolFilter,
  number: NumberFilter,
  date: DateFilter
}
const operatorsForType = {
  number: 'gte',
  string: 'contains',
  date: 'inrange',
  boolean: 'eq'
}

type CustomRendererMatcher = {
  match: { [key: string]: any }
  render: (...args: any[]) => ReactNode
}

const customRendererForType: CustomRendererMatcher[] = [
  {
    match: {type: 'boolean'},
    render: ({value}) => !!value ? <CheckBox/> : <CheckBoxOutlineBlank/>
  },
  {
    match: {type: 'string', name: 'contact_email'},
    render: ({value}) => (<a href={`mailto:${value}`}>{value}</a>)
  }
]

const findMatchingRenderer = (c: ColumnRaw) => {
  const customRenderer = customRendererForType.find(d => {
    // @ts-ignore
    return Object.keys(d.match).reduce((prev, cur) => prev && c[cur] === d.match[cur], true)
  })
  return customRenderer?.render
}

const columns: TypeColumn[] = columnsRaw
  .map(c => ({
    ...c,
    render: findMatchingRenderer(c) || undefined,
    filterEditor: filterMappings[c.type as 'string' | 'number' | 'boolean' | 'date']
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

const HostOfferLookupTable = ({data}: HostOfferLookupTableProps) => {
  const dataSource = data.get_offers || []

  const {i18n: {language}} = useTranslation()
  // @ts-ignore
  const reactdatagridi18n = resources[language]?.translation?.reactdatagrid


  return <Box sx={{display: 'flex', alignItems: 'stretch', flexDirection: 'column', minHeight: '100%'}}>
    <div
      style={{flex: '1 1', height: '100%'}}
    >
      <DataGrid
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
      />
    </div>
  </Box>
}

export default HostOfferLookupTable
