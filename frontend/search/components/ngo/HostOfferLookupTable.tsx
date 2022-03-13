import React, {ReactNode, useCallback} from 'react'

import {CheckBoxOutlineBlank, CheckBox} from '@mui/icons-material'

import '@inovua/reactdatagrid-community/index.css'

import DataGrid from '@inovua/reactdatagrid-community'
import {TypeColumn, TypeFilterValue, TypeSingleFilterValue} from "@inovua/reactdatagrid-community/types"
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import StringFilter from '@inovua/reactdatagrid-community/StringFilter'
import BoolFilter from '@inovua/reactdatagrid-community/BoolFilter'
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter"
import BoolEditor from '@inovua/reactdatagrid-community/BoolEditor'
import {GetOffersQuery} from "../../codegen/generates"
import moment from "moment"

import {useTranslation} from "react-i18next"
import {resources} from '../../i18n/config'
import {Box} from "@mui/material"

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
  group: string;
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
    "name": "rw_contacted",
    "group": "contactStatus",
    "header": "Asked",
    "type": "boolean",
    "editable": true,
    "defaultWidth": 85
  },
  {
    "name": "rw_contact_replied",
    "group": "contactStatus",
    "header": "Answered",
    "type": "boolean",
    "editable": true,
    "defaultWidth": 110
  },
  {
    "name": "rw_offer_occupied",
    "group": "offerStatus",
    "header": "Occupied",
    "type": "boolean",
    "editable": true,
    "defaultWidth": 110
  },
  {
    "name": "rw_note",
    "header": "Our notes",
    "type": "string",
    "editable": true,
    "defaultWidth": 400
  },
  {
    "name": "place_country",
    "group": "locationCoarse",
    "header": "Country",
    "type": "string",
    "defaultWidth": 10
  },
  {
    "name": "place_city",
    "group": "locationCoarse",
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
    "group": "time",
    "header": "From",
    "type": "date",
    "defaultWidth": 90
  },
  {
    "name": "time_duration_str",
    "group": "time",
    "header": "Duration",
    "type": "string"
  },
  {
    "name": "languages",
    "header": "Languages",
    "type": "object",
    "defaultWidth": 200
  },
  {
    "name": "accessible",
    "group": "features",
    "header": "Accessible",
    "type": "boolean",
    "defaultWidth": 120
  },
  {
    "name": "animals_allowed",
    "group": "animals",
    "header": "Allowed",
    "type": "boolean",
    "defaultWidth": 100
  },
  {
    "name": "animals_present",
    "group": "animals",
    "header": "Present",
    "type": "boolean",
    "defaultWidth": 95
  },
  {
    "name": "note",
    "header": "User comment",
    "type": "string",
    "defaultWidth": 400
  },
  {
    "name": "contact_name_full",
    "group": "contact",
    "header": "Name",
    "type": "string"
  },
  {
    "name": "contact_phone",
    "group": "contact",
    "header": "Phone",
    "type": "string"
  },
  {
    "name": "contact_email",
    "group": "contact",
    "header": "EMail",
    "type": "string"
  },
  {
    "name": "place_street",
    "group": "address",
    "header": "Street",
    "type": "string"
  },
  {
    "name": "place_street_number",
    "group": "address",
    "header": "Number",
    "type": "string",
    "defaultWidth": 100
  },
  {
    "name": "place_zip",
    "group": "address",
    "header": "Zip",
    "type": "string",
    "defaultWidth": 80
  },
]

const groups = [
  { name: 'contactStatus', header: 'Contact Status' },
  { name: 'offerStatus', header: 'Offer Status' },
  { name: 'locationCoarse', header: 'Location' },
  { name: 'time', header: 'Time' },
  { name: 'features', header: 'Limitations / Features' },
  { name: 'animals', group: 'features', header: 'Animals' },
  { name: 'contact', header: 'Contact' },
  { name: 'address', group: 'contact', header: 'Address' },
]

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

const columns: TypeColumn[] = columnsRaw
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

const HostOfferLookupTable = ({data_ro, data_rw, refetch_rw}: HostOfferLookupTableProps) => {
  const dataSource = !data_ro.get_offers ? [] : data_ro.get_offers.map( e_ro => ({...e_ro, ...data_rw.find((e_rw: any) => e_rw.id === e_ro.id)}) )

  const auth = useAuthStore()

  const onEditComplete = useCallback(async ({value, columnId, rowId}) => {
    /** For now the easiest way to ensure the user can see if data was updated in the db is by calling `refetch_rw()`
        TODO: error handling **/
    await mutate(auth, {value, columnId, rowId}) && refetch_rw()
  }, [auth, refetch_rw])

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
	groups={groups}
      />
    </div>
  </Box>
}

export default HostOfferLookupTable
