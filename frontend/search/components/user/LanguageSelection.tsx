import {ListItemIcon, ListItemText, MenuItem, Select} from '@mui/material'
import i18next from 'i18next'
import '../../i18n/config'
import {useTranslation} from "react-i18next";
import {resources} from "../../i18n/config";
import { countryCodeEmoji  } from 'country-code-emoji';


const flagMapping = {
  en: 'GB',
  eng: 'GB',
  ger: 'DE'
}

const Flag = ({langCode}: {langCode: string}) => {
  // @ts-ignore
  const countryCode = (flagMapping[langCode] || langCode).toUpperCase()
  let emoji = ''
  try {
    emoji = countryCodeEmoji(countryCode)
  } catch (e) {}
  return <>{emoji}</>
}


export default function LanguageSelection() {
  const { t, i18n: {language }} = useTranslation()
  const languages = Object.keys(resources)

  return  (
    <Select value={language} renderValue={v => <Flag langCode={v} />}>
     { languages.map( lang => (
         <MenuItem dense value={lang}  key={lang} onClick={() => i18next.changeLanguage(lang)} >
           <ListItemIcon><Flag langCode={lang}/></ListItemIcon>
           <ListItemText>{t(lang)}</ListItemText>
         </MenuItem>
       ))
     }
    </Select>
  )
}
