import React, {useCallback, useEffect} from 'react'
import { useGetOffersQuery, useGetRwQuery } from "../../codegen/generates"
import HostOfferLookupTable, {HostOfferLookupTableDataType, HostOfferLookupTableProps} from "./HostOfferLookupTable"
import { Box } from "@mui/material"
import { useTranslation } from 'react-i18next'
import { Login, useAuthStore } from '../Login'
import {Marker, useLeafletStore} from './LeafletStore'
import { filterUndefOrNull } from '../util/notEmpty'
import { haversine_distance } from '../util/distance'
import {marker} from "leaflet";

type HostOfferLookupWrapperProps = Partial<HostOfferLookupTableProps>

function floor(v: number|undefined) {
  return v && Math.floor(v)
}

//type HostOfferLookupTableDataRowType = NonNullable<HostOfferLookupTableDataType>[number]
const makeMarker: (row: { id?: string | null; place_lon?: number | null; place_lat?: number | null }) => Marker | undefined =
  ({ id, place_lon, place_lat }) => id && place_lon && place_lat && ({
    id: id,
    lat: place_lat,
    lng: place_lon,
    radius: 1000,  // TODO
    content: 'TODO'
  }) || undefined;

const HostOfferLookupWrapper = (props: HostOfferLookupWrapperProps) => {
  const { t } = useTranslation()
  const auth = useAuthStore()

  const staleTimeMinutes_ro = 5
  const staleTimeMinutes_rw = 1
  const queryResult_ro = useGetOffersQuery({auth}, {enabled: !!auth.jwt, staleTime: staleTimeMinutes_ro * 60 * 1000})
  const queryResult_rw = useGetRwQuery({auth}, {enabled: !!auth.jwt, staleTime: staleTimeMinutes_rw * 60 * 1000})
  const {data: data_ro} = queryResult_ro
  const {data: data_rw} = queryResult_rw

  const {setMarkers, center, setFilteredMarkers} = useLeafletStore()
  useEffect(() => {
    const markers = filterUndefOrNull( data_ro?.get_offers?.map(makeMarker) )


    setMarkers(filterUndefOrNull(markers))
  }, [data_ro])

  const data_ro_withDistance = data_ro?.get_offers?.map(r => ({...r,
                                                               place_distance: floor(haversine_distance(center?.lat, center?.lng, r.place_lat, r.place_lon))}))

  const handleFilteredDataChange = useCallback(
    (data:  HostOfferLookupTableDataType[]) => {
      // @ts-ignore
      const _filteredMarkers = filterUndefOrNull( data.map(d => d && makeMarker(d)))
      console.log({_filteredMarkers})
      //setFilteredMarkers(_filteredMarkers)
    },
    [setFilteredMarkers],
  );

  return <>
    <Box sx={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        height: '100%'}}>
      <div style={{minHeight: '2em', display: 'flex'}}>
        { (queryResult_ro.isFetching || queryResult_rw.isFetching) && t('loading…') }
        { (queryResult_ro.error || queryResult_rw.error) && t('An error occurred while trying to get data from the backend.') }
        { (data_ro && !data_ro.get_offers || data_rw && !data_rw.get_rw)
          && t('Seems like you have no permissions. Please try to login again.') }
        <Login/>
      </div>
      {data_ro && <div
          style={{flex: '1 1', height: '100%'}}>
            <HostOfferLookupTable
              {...props}
              data_ro={data_ro_withDistance}
              data_rw={data_rw?.get_rw}
              refetch_rw={queryResult_rw.refetch}
              onFilteredDataChange={handleFilteredDataChange}
            />
        </div>}
    </Box>
  </>
}

export default HostOfferLookupWrapper
