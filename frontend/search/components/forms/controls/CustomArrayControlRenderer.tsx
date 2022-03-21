import React, {ComponentType, useCallback} from 'react'
import _ from 'lodash';
import {
  Hidden,
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox, SelectChangeEvent
} from "@mui/material";

import {useTranslation} from "react-i18next";
import {CustomArrayLayoutProps, withJsonFormsArrayLayoutProps} from "./resolveHOCs";

const CustomArrayControlRenderer = ({removeItems, addItem, visible, schema, arrayData, path, label }: CustomArrayLayoutProps) => {
  const values: string[] =  arrayData || []
  const  { t } = useTranslation()

  const options = schema.oneOf?.map(({const: key, title}) => ({
    key: key as string,
    value: key,
    label: title
  }))

  const getLabel = (_key:string) =>
   options?.find(({key}) => key === _key)?.label || _key

  const handleChange = useCallback(
    ({ target: { value: targetValues } }: SelectChangeEvent<string[]>) => {
      const diff = _.xor(values, targetValues)
      if(targetValues.length > values.length) {
        diff.forEach(item => addItem(path, item)())
      } else {
        diff.forEach(item => {
          const i = values.indexOf(item)
          i > -1 && removeItems && removeItems(path, [i])()
        })}},
    [addItem, removeItems, values]);

  return <Hidden xsUp={!visible}>
    <FormControl fullWidth={true}>
      <InputLabel id="multiple-checkbox-label">{label}</InputLabel>
      {<Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={values}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected: string[]) => selected.map(s => t(getLabel(s))).join(', ')}
      >
        {options?.map(({key, value, label}) => (
          <MenuItem key={key} value={value}>
            <Checkbox checked={values.indexOf(value) > -1} />
            <ListItemText primary={label ? t(label) : t(key)} />
          </MenuItem>
        ))}
      </Select>}
    </FormControl>
  </Hidden>
}

export default withJsonFormsArrayLayoutProps(CustomArrayControlRenderer)
