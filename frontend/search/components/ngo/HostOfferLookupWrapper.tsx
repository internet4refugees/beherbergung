import React from 'react'
import {Auth, useGetOffersQuery} from "../../codegen/generates";
import testAuth from '../util/testAuth.json'
import HostOfferLookupTable from "./HostOfferLookupTable";
import {Box} from "@mui/material";

type HostLookupWrapperProps = Record<string, never>

const HostOfferLookupWrapper = ({}: HostLookupWrapperProps) => {
  const staleTimeMinutes = 60  // hotfix till table settings by user (columns width, filters, sort options, …) are persisted
  const {data, isFetching} = useGetOffersQuery({auth: testAuth as Auth}, {staleTime: staleTimeMinutes * 60 * 1000})

  return <>
    { isFetching && <p> loading… </p> }
    { data?.get_offers && <Box sx={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        height: '100%'}}>
        <div
          style={{flex: '1 1', height: '100%'}}>
            <HostOfferLookupTable data={data}/>
        </div>
    </Box> }
  </>
}

export default HostOfferLookupWrapper
