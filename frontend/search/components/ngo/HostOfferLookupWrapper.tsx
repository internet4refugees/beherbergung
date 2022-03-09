import React from 'react'
import {Auth, useGetOffersQuery} from "../../codegen/generates";
import testAuth from '../util/testAuth.json'
import HostOfferLookupTable from "./HostOfferLookupTable";

type HostLookupWrapperProps = Record<string, never>

const HostOfferLookupWrapper = ({}: HostLookupWrapperProps) => {
  const {data, isFetching} = useGetOffersQuery({auth: testAuth as Auth}, {staleTime: 60 * 1000})

  return <>{
    (!isFetching && data?.get_offers) ? <HostOfferLookupTable data={data}/> : "loading…"
  }</>
}

export default HostOfferLookupWrapper
