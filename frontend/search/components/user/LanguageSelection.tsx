import {ListItemIcon, ListItemText, MenuItem, Select} from '@mui/material'
import i18next from 'i18next'
import '../../i18n/config'
import {useTranslation} from "react-i18next";
import {resources} from "../../i18n/config";
import { countryCodeEmoji  } from 'country-code-emoji';
import {useEffect, useState} from "react";


const flagMapping = {
  en: 'GB',
  eng: 'GB',
  ger: 'DE'
}

const Flag = ({langCode}: {langCode: string}) => {

  const [emoji, setEmoji] = useState('');
  useEffect(() => {
    try {
      // @ts-ignore
      const countryCode = (flagMapping[langCode] || langCode).toUpperCase()
      const emoji = countryCodeEmoji(countryCode)
      if(emoji) setEmoji(emoji)
    } catch (e) {}
  }, [langCode]);

  return <>{emoji}</>
}


export default function LanguageSelection() {
  const { t, i18n: {language }} = useTranslation()
  const languages = Object.keys(resources)

  const selectedLang = languages.includes(language) ? language : 'en'

  return  (
    <Select value={selectedLang} renderValue={v => <Flag langCode={v} />}>
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
