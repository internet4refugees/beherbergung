import React, {useCallback, useEffect, useState} from 'react'

import '@inovua/reactdatagrid-community/index.css'

import {GetColumnsQuery, GetOffersQuery, GetRwQuery} from "../../codegen/generates"

import {useTranslation} from "react-i18next"
import {resources} from '../../i18n/config'

import {fetcher} from '../../codegen/fetcher'
import {useAuthStore} from '../Login'
import defaultColumnGroups from "../config/defaultColumnGroups";
import {filterUndefOrNull} from "../util/notEmpty";
import {haversine_distance} from "../util/distance";
import {useLeafletStore} from "./LeafletStore";
import DeclarativeDataGrid from "./DeclarativeDataGrid";
import {TypeColumns} from "@inovua/reactdatagrid-community/types/TypeColumn";
import {ShareLocation} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {LatLng} from "../util/geo";

export type HostOfferLookupTableDataType =
  Omit<NonNullable<(GetOffersQuery["get_offers"] & GetRwQuery["get_rw"])>[number], '__typename'>
  & { place_distance?: number };

type HostOfferColumnRawType = NonNullable<GetColumnsQuery["get_columns"]>

export type HostOfferLookupTableProps = {
  data_ro?: GetOffersQuery["get_offers"],
  data_rw?: GetRwQuery["get_rw"],  // TODO
  refetch_rw: any,
  onFilteredDataChange?: (data: HostOfferLookupTableDataType[]) => void
  center?: LatLng
  columnsRaw: HostOfferColumnRawType
  groupsDisabled?: boolean
  debugEnabled?: boolean
}

const floor = (v: number | undefined) => v && Math.floor(v);

const calculateDistance = (r: { place_lat?: number | null, place_lon?: number | null }, [lat, lng]: LatLng) =>
  r.place_lat && r.place_lon && lng && lat && floor(haversine_distance(lat, lng, r.place_lat, r.place_lon))

async function mutate(auth: { jwt: string }, onEditComplete: { value: string, columnId: string, rowId: string }) {
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

const rw_default = {
  rw_contacted: false,
  rw_contact_replied: false,
  rw_offer_occupied: false,
  rw_note: ''
}  // Required for filtering 'Not empty'. TODO: Should be fixed in StringFilter

function objectWithoutNil<T extends { [k: string]: any } | undefined>(o: T): Partial<T> {
  return o && Object.fromEntries(
    Object.entries(o).filter(
      ([, v]) => ![null, undefined].includes(v))) as Partial<T>
}

function mergeRoAndRw(data_ro: HostOfferLookupTableProps['data_ro'], data_rw: HostOfferLookupTableProps['data_rw']) {
  return data_ro
    ?.map(e_ro => ({
      ...rw_default,
      ...e_ro,
      ...objectWithoutNil(data_rw?.find((e_rw) => e_ro.id_tmp === e_rw.id)),
      ...objectWithoutNil(data_rw?.find((e_rw) => `rw_${e_ro.id}` === e_rw.id)),
      id: e_ro.id
    })) || []
}

const dataItem2LngLat: (item: HostOfferLookupTableDataType) => LatLng  = ({place_lat, place_lon }) => {
  const ensureNumber = (n: string | number) => typeof n === 'string' ? parseFloat(n) : n
  const lat = ensureNumber(place_lat)
  const lng = ensureNumber(place_lon)
  if (!lat || isNaN(lat) || !lng || isNaN(lng)) return
  return [lat, lng]

}



const HostOfferLookupTable = ({
                                data_ro,
                                data_rw,
                                refetch_rw,
                                onFilteredDataChange,
                                center,
                                columnsRaw,
                                groupsDisabled,
                                debugEnabled
                              }: HostOfferLookupTableProps) => {
  const [dataSource, setDataSource] = useState<HostOfferLookupTableDataType[]>([]);

  useEffect(() => {
    const data = filterUndefOrNull(mergeRoAndRw(data_ro, data_rw))
      .map(v => center ? {...v, place_distance: calculateDistance(v, center) || Infinity} : v)
    // @ts-ignore
    data && setDataSource(data)
  }, [columnsRaw, data_ro, data_rw, center]);

  const {jwt} = useAuthStore()

  const onEditComplete = useCallback(async ({value, columnId, rowId}) => {
    /** For now the easiest way to ensure the user can see if data was updated in the db is by calling `refetch_rw()`
     TODO: error handling **/
    await mutate({jwt}, {value, columnId, rowId}) && refetch_rw()
  }, [jwt, refetch_rw])

  const {i18n: {language}} = useTranslation()
  // @ts-ignore
  const reactdatagridi18n = resources[language]?.translation?.reactdatagrid

  const {selectedId, setSelectedId, zoomToCoordinate} = useLeafletStore()

  const handleRowSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [setSelectedId])

  const firstColumns: TypeColumns = [
    {
      name: 'action', resizable: true, defaultWidth: 50,
      render: ({data}) => {
        const c = dataItem2LngLat(data)
        return <span>
          <IconButton
            aria-label={'zoom to POI'}
            disabled={!c}
            onClick={() => {
              zoomToCoordinate && c && zoomToCoordinate(c)
            }}>
            <ShareLocation/>
          </IconButton>
      </span>;
      }
    }]

  return dataSource && <DeclarativeDataGrid
    i18n={reactdatagridi18n || undefined}
    onEditComplete={onEditComplete}
    groups={groupsDisabled ? undefined : defaultColumnGroups}
    columnsRaw={columnsRaw}
    firstColumns={firstColumns}
    selectedId={selectedId}
    onRowSelect={handleRowSelect}
    data={dataSource}
    onFilteredDataChange={onFilteredDataChange}
    debugEnabled={debugEnabled}
  />
}

export default HostOfferLookupTable
