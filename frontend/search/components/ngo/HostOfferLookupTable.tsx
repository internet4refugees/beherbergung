import React from 'react'
import '@inovua/reactdatagrid-community/index.css'

import DataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import StringFilter from '@inovua/reactdatagrid-community/StringFilter'
import BoolFilter from '@inovua/reactdatagrid-community/BoolFilter'
import {GetOffersQuery} from "../../codegen/generates";
import {TypeColumn, TypeFilterValue, TypeSingleFilterValue} from "@inovua/reactdatagrid-community/types";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import moment from "moment";

global.moment = moment

type HostOfferLookupTableProps = {
  data: GetOffersQuery
}

const columnsRaw: { name: string; header: string; type: string }[] = [
  {
    "name": "beds",
    "header": "beds",
    "type": "number"
  },
  {
    "name": "place_street",
    "header": "place street",
    "type": "string"
  },
  {
    "name": "contact_email",
    "header": "contact email",
    "type": "object"
  },
  {
    "name": "contact_name_full",
    "header": "contact name full",
    "type": "string"
  },
  {
    "name": "time_duration_str",
    "header": "time duration str",
    "type": "string"
  },
  {
    "name": "note",
    "header": "note",
    "type": "string"
  },
  {
    "name": "place_street_number",
    "header": "place street number",
    "type": "string"
  },
  {
    "name": "place_city",
    "header": "place city",
    "type": "string"
  },
  {
    "name": "contact_phone",
    "header": "contact phone",
    "type": "object"
  },
  {
    "name": "place_zip",
    "header": "place zip",
    "type": "string"
  },
  {
    "name": "time_from_str",
    "header": "time from str",
    "type": "date"
  },
  {
    "name": "place_country",
    "header": "place country",
    "type": "string"
  },
  {
    "name": "animals_present",
    "header": "animals present",
    "type": "boolean"
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
  }
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
  date: 'inrange'}


const columns: TypeColumn[] = columnsRaw
  .map(c => ({
    ...c,
    filterEditor: filterMappings[c.type as 'string' | 'number' | 'boolean' | 'date']
  }))

const defaultFilterValue: TypeFilterValue = columns
  .filter(( {type} ) => type && ['string', 'number', 'date'].includes( type ))
  .map(( {name, type} ) => {
    return {
      name,
      type,
      value: '',
      operator: operatorsForType[type as 'string' | 'number' | 'date']
    } as unknown as TypeSingleFilterValue
  } )

const makeColumnDefinition = (data: any ) => Object.keys(data)
  .map(k => ({
    name: k,
    header: k.replace(/_/g, ' '),
    type: typeof data[k]}))

const HostOfferLookupTable = ({ data }: HostOfferLookupTableProps) => {
  const dataSource = data.get_offers || []
  return <>
    <DataGrid
      idProperty="id"
      filterable
      showColumnMenuFilterOptions={true}
      showFilteringMenuItems={true}
      defaultFilterValue={defaultFilterValue}
      rowIndexColumn
      enableSelection
      columns={columns}
      dataSource={dataSource}
      style={{minHeight: '1000px'}}
    />
  </>
}

export default HostOfferLookupTable
