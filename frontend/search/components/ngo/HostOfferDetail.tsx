import React, {useEffect, useState} from 'react'
import {useAppTempStore} from "../config/appTempStore";
import {Typography} from "@mui/material";
import {useLeafletStore} from "./LeafletStore";
import {HostOfferLookupTableDataType} from "./HostOfferLookupTable";

type HostOfferDetailProps = Record<string, never>

const HostOfferDetail = ({}: HostOfferDetailProps) => {
  const { hostOffers } = useAppTempStore()
  const { selectedId } = useLeafletStore()
  const [offer, setOffer] = useState<HostOfferLookupTableDataType | undefined>();

  useEffect(() => {
    setOffer(hostOffers.find(({id}) => id === selectedId))
  }, [hostOffers, selectedId, setOffer]);

  return <div>
    {offer && <>
      <Typography variant={'h4'}>{offer.contact_name_full}</Typography>
      <Typography variant={'body1'}>{offer.rw_note}</Typography>
    </>
    }
  </div>;
}

export default HostOfferDetail
