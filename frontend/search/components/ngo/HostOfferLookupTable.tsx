import React, {ReactNode, useCallback} from 'react'

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

import { fetcher } from '../../codegen/fetcher'
import { useAuthStore, AuthState } from '../Login'

global.moment = moment

type HostOfferLookupTableProps = {
  data_ro: GetOffersQuery,
  data_rw: any,  // TODO
  refetch_rw: any,
}

interface ColumnRaw {
  name: string;
  header: string;
  type: string;
  editable: boolean;
  defaultWidth: number;
}

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

const columnsRaw: Partial<ColumnRaw>[] = [
  {
    "name": "place_country",
    "header": "Country",
    "type": "string",
    "defaultWidth": 10
  },
  {
    "name": "place_city",
    "header": "City",
    "type": "string"
  },
  {
    "name": "beds",
    "header": "Beds",
    "type": "number"
  },
  {
    "name": "time_from_str",
    "header": "From",
    "type": "date",
    "defaultWidth": 90
  },
  {
    "name": "time_duration_str",
    "header": "Duration",
    "type": "string"
  },
  {
    "name": "languages",
    "header": "languages",
    "type": "object",
    "defaultWidth": 200
  },
  {
    "name": "accessible",
    "header": "accessible",
    "type": "boolean",
    "defaultWidth": 80
  },
  {
    "name": "animals_allowed",
    "header": "allows animals",
    "type": "boolean",
    "defaultWidth": 80
  },
  {
    "name": "animals_present",
    "header": "has animals",
    "type": "boolean",
    "defaultWidth": 80
  },
  {
    "name": "rw_note",
    "header": "Our notes",
    "type": "string",
    "editable": true,
    "defaultWidth": 400
  },
  {
    "name": "note",
    "header": "User comment",
    "type": "string",
    "defaultWidth": 400
  },
  {
    "name": "contact_name_full",
    "header": "Name",
    "type": "string"
  },
  {
    "name": "contact_phone",
    "header": "Phone",
    "type": "string"
  },
  {
    "name": "contact_email",
    "header": "EMail",
    "type": "string"
  },
  {
    "name": "place_street",
    "header": "Street",
    "type": "string"
  },
  {
    "name": "place_street_number",
    "header": "Street number",
    "type": "string",
    "defaultWidth": 80
  },
  {
    "name": "place_zip",
    "header": "Zip",
    "type": "string",
    "defaultWidth": 80
  },
]

const filterMappings = {
  string: StringFilter,
  boolean: BoolFilter,
  number: NumberFilter,
  date: DateFilter,
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

const findMatchingRenderer = (c: Partial<ColumnRaw>) => {
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

async function mutate(auth: AuthState, onEditComplete: {value: string, columnId: string, rowId: string}) {
  const result = await fetcher<any, any>(`mutation WriteRW($auth: Auth!, $onEditComplete: Boolean) {
                                            write_rw(auth: $auth, onEditComplete: $onEditComplete) }`,
                                         {auth, onEditComplete})()
  return result?.write_rw
}

const HostOfferLookupTable = ({data_ro, data_rw, refetch_rw}: HostOfferLookupTableProps) => {
  const dataSource = !data_ro.get_offers ? [] : data_ro.get_offers.map( e_ro => ({...e_ro, ...data_rw.find((e_rw: any) => e_rw.id === e_ro.id)}) )

  const auth = useAuthStore()

  const onEditComplete = useCallback(async ({value, columnId, rowId}) => {
    /** For now the easiest way to ensure the user can see if data was updated in the db is by calling `refetch_rw()`
        TODO: error handling **/
    (value || value==='') && await mutate(auth, {value, columnId, rowId}) && refetch_rw()
  }, [dataSource])

  const {i18n: {language}} = useTranslation()
  // @ts-ignore
  const reactdatagridi18n = resources[language]?.translation?.reactdatagrid


  return <Box sx={{
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      height: '100%'}}>
    <div
      style={{flex: '1 1', height: '100%'}}>
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
	onEditComplete={onEditComplete}
      />
    </div>
  </Box>
}

export default HostOfferLookupTable
