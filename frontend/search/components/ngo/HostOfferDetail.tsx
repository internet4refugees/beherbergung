import React, {useCallback, useEffect, useState} from 'react'
import {useAppTempStore} from "../config/appTempStore";
import {Box, Button, Divider, Typography} from "@mui/material";
import {useLeafletStore} from "./LeafletStore";
import {HostOfferLookupTableDataType} from "./HostOfferLookupTable";
import {useGetColumnsQuery} from "../../codegen/generates";
import {useAuthStore} from "../Login";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import DetailViewForm from "../forms/DetailViewForm";
import {useTranslation} from "react-i18next";
import {ErrorObject} from "ajv";
import {mutate, OnEditCompleteVariables} from "../util/mutations/mutate";

type HostOfferDetailProps = Record<string, never>

const HostOfferDetail = ({}: HostOfferDetailProps) => {
  const {hostOffers} = useAppTempStore()
  const {selectedId} = useLeafletStore()
  const [offer, setOffer] = useState<HostOfferLookupTableDataType | undefined>();
  const [modifiedOffer, setModifiedOffer] = useState<HostOfferLookupTableDataType | undefined>();
  const [mutationChangeSet, setMutationChangeSet] = useState<OnEditCompleteVariables[]>([]);

  const [jsonschema, setJsonschema] = useState<JsonSchema | undefined>();
  const [uischema, setUischema] = useState<UISchemaElement | undefined>();

  const { t } = useTranslation()
  const {jwt, mail, password} = useAuthStore()
  const staleTimeMinutes_columns = 60
  const {data: data_columns} = useGetColumnsQuery({auth: {jwt, mail, password}}, {
    enabled: !!jwt,
    staleTime: staleTimeMinutes_columns * 60 * 1000
  })

  useEffect(() => {
    const _offer = hostOffers.find(({id}) => id === selectedId)
    setOffer(_offer)
    setModifiedOffer(_offer)
  }, [hostOffers, selectedId, setOffer, setModifiedOffer]);

  useEffect(() => {
    const columns = data_columns?.get_columns
    if(!columns) return
    let jsonSchemaProps: any = columns.reduce((acc, obj) => ({
      ...acc,
      [obj.name]: {
        type: obj.type,
        readonly: !obj.editable
      }}), {})
    jsonSchemaProps.languages = {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
    let newUiSchema: any = {
      type: "VerticalLayout",
      elements:
        columns.map(({name, header, editable}) => {
          const multiOpt = name.includes('note') ? { multi: true} : undefined
          return {
            type: "Control",
            scope: `#/properties/${name}`,
            label: header,
            options: {
              ...multiOpt,
              readonly: !editable
            }
          }
        })
    }
    const newJsonSchema = {
      type: "object",
      properties: jsonSchemaProps
    }
    setJsonschema(newJsonSchema)
    setUischema(newUiSchema)
    console.log({newJsonSchema, newUiSchema})

  }, [data_columns]);

  const calculateChanges = useCallback(
    (newData: HostOfferLookupTableDataType) => {
      const rowId = newData.id
      const fields = Object.entries(newData)
        .filter(([key, value]) => {
          const oldValue = (offer as any)[key]
          return  oldValue !== value;
        })
      const onEditCompletes = fields.map(([columnId, value]) => ({
        columnId,
        rowId,
        value
      }))
      // @ts-ignore
      setMutationChangeSet(onEditCompletes)
    }, [ offer])

  const saveChanges = useCallback(
    () => {
      console.log('save')
      mutationChangeSet.forEach(changeSet => {
        try {
          mutate({ jwt }, changeSet)
        }catch (e) {
          console.error('caanot update', e)
        }
      })
    },
    [mutationChangeSet],
  );


  const handleChange = useCallback(
    ({errors, data}: {errors: ErrorObject[], data: HostOfferLookupTableDataType}) => {
      if(!data) return
      setModifiedOffer(data)
      calculateChanges(data)
    }, [setModifiedOffer]);


  return <div>
    {offer && <Box padding={'1em'}>
      <Typography variant={'h4'}>{offer.contact_name_full}</Typography>
      <Divider />
      <DetailViewForm
        data={modifiedOffer}
        onChange={handleChange}
        schema={jsonschema}
        uischema={uischema} />
      <Button onClick={saveChanges} disabled={!mutationChangeSet.length}>{t("save")}</Button>
    </Box>
    }
  </div>
}

export default HostOfferDetail
