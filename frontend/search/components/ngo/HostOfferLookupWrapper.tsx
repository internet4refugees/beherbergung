import React, {useCallback, useEffect} from 'react'
import {useGetOffersQuery, useGetRwQuery} from "../../codegen/generates"
import HostOfferLookupTable, {HostOfferLookupTableDataType, HostOfferLookupTableProps} from "./HostOfferLookupTable"
import {Box} from "@mui/material"
import {useTranslation} from 'react-i18next'
import {useAuthStore} from '../Login'
import {Marker, useLeafletStore} from './LeafletStore'
import {filterUndefOrNull} from '../util/notEmpty'
import {useGetColumnsQuery} from "../../codegen/generates"
import CustomAppBar from "../user/CustomAppBar";
import {useAppConfigStore} from "../config/appConfigStore";
type HostOfferLookupWrapperProps = Partial<HostOfferLookupTableProps>

//type HostOfferLookupTableDataRowType = NonNullable<HostOfferLookupTableDataType>[number]
const makeMarker: (row: { id?: string | null; place_lon?: number | null; place_lat?: number | null }) => Marker | undefined =
  ({id, place_lon, place_lat}) => id && place_lon && place_lat && ({
    id: id,
    lat: place_lat,
    lng: place_lon,
    radius: 1000,  // TODO
    content: 'TODO'
  }) || undefined;

const HostOfferLookupWrapper = (props: HostOfferLookupWrapperProps) => {
  const {t} = useTranslation()
  const auth = useAuthStore()

  const { groupsDisabled, debugEnabled } = useAppConfigStore()

  const staleTimeMinutes_ro = 5
  const staleTimeMinutes_rw = 1
  const staleTimeMinutes_columns = 60
  const queryResult_ro = useGetOffersQuery({auth}, {enabled: !!auth.jwt, staleTime: staleTimeMinutes_ro * 60 * 1000})
  const queryResult_rw = useGetRwQuery({auth}, {enabled: !!auth.jwt, staleTime: staleTimeMinutes_rw * 60 * 1000})
  const {data: data_ro} = queryResult_ro
  const {data: data_rw} = queryResult_rw

  const {setMarkers, center, setWithinFiltered} = useLeafletStore()
  useEffect(() => {
    const markers = filterUndefOrNull(data_ro?.get_offers?.map(makeMarker))
    setMarkers(filterUndefOrNull(markers))
  }, [data_ro, setMarkers])

  const handleFilteredDataChange = useCallback(
    (data: HostOfferLookupTableDataType[]) => {
      const filteredIds = filterUndefOrNull(data.map(d => d && d.id))
      setWithinFiltered(filteredIds)
    },
    [setWithinFiltered],
  );

  const {data: data_columns} = useGetColumnsQuery({auth}, {
    enabled: !!auth.jwt,
    staleTime: staleTimeMinutes_columns * 60 * 1000
  })
  const columnsRaw = data_columns?.get_columns

  return <>
    <Box sx={{
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      height: '100%'
    }}>
      <CustomAppBar status={<>
        {(queryResult_ro.isFetching || queryResult_rw.isFetching) && t('loading…')}
        {(queryResult_ro.error || queryResult_rw.error) && t('An error occurred while trying to get data from the backend.')}
        {(data_ro && !data_ro.get_offers || data_rw && !data_rw.get_rw)
          && t('Seems like you have no permissions. Please try to login again.')}
      </>
      }/>
      {columnsRaw && data_ro && <div
        style={{flex: '1 1', height: '100%'}}>
        <HostOfferLookupTable
          {...props}
          data_ro={data_ro.get_offers}
          data_rw={data_rw?.get_rw}
          refetch_rw={queryResult_rw.refetch}
          onFilteredDataChange={handleFilteredDataChange}
          center={center || undefined}
          columnsRaw={columnsRaw}
          groupsDisabled={groupsDisabled}
	  debugEnabled={debugEnabled}
        />
      </div>}
    </Box>
  </>
}

export default HostOfferLookupWrapper
