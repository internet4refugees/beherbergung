import React from 'react'
import {GetOffersQuery} from "../../codegen/generates";

type HostOfferLookupTableProps = {
  data: GetOffersQuery
}

const HostOfferLookupTable = ({ data }: HostOfferLookupTableProps) => {
  return <>
    { data.get_offers?.map(offer => (<div>{offer.contact_name_full}</div>)) }
  </>
}

export default HostOfferLookupTable
