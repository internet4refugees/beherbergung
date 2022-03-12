import React from 'react'
import { useGetOffersQuery } from "../../codegen/generates"
import HostOfferLookupTable from "./HostOfferLookupTable"
import { Box } from "@mui/material"
import { useTranslation } from 'react-i18next'
import { Login, useAuthStore } from '../Login'

type HostLookupWrapperProps = Record<string, never>

const HostOfferLookupWrapper = ({}: HostLookupWrapperProps) => {
  const { t } = useTranslation()
  const auth = useAuthStore()

  const staleTimeMinutes = 60  // hotfix till table settings by user (columns width, filters, sort options, …) are persisted
  const {data, isFetching, error} = useGetOffersQuery({auth}, {staleTime: staleTimeMinutes * 60 * 1000})

  return <>
    { !data?.get_offers && <Login/> /** TODO: Show logout, by placing <Login/> in Header at Layout **/ }

    { isFetching && <p>{ t('loading…') }</p> }
    { error && <p>{ t('An error occurred while trying to get data from the backend.') }</p> }
    { data && !data.get_offers && <p>{ t('Seems like you have no permissions. Please try to login again.') }</p> }
    { data?.get_offers && <Box sx={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        height: '100vh'}}>
        <div
          style={{flex: '1 1', height: '100%'}}>
            <HostOfferLookupTable data={data}/>
        </div>
    </Box> }
  </>
}

export default HostOfferLookupWrapper
