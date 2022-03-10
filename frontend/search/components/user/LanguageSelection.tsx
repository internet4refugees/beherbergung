import i18next from 'i18next'
import '../../i18n/config'


export default () => {
  const languages =   [{id: 'de', name: 'Deutsch'}, {id: 'en', name: 'Englisch'}]

  return  (
    <div>
     { languages.map( lang => (
         <span key={lang.id}>
           <button title={lang.name}
	        onClick={() => i18next.changeLanguage(lang.id)}
           >{lang.name}</button>
         </span>
       ))}
    </div>
  )
}
