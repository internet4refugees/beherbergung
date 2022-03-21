import {useState} from 'react';
import {JsonForms} from '@jsonforms/react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import {useTranslation} from "react-i18next";
import {
  createAjv,
  JsonFormsI18nState,
  Translator
} from "@jsonforms/core";
import {JsonFormsInitStateProps, JsonFormsReactProps} from "@jsonforms/react/lib/JsonForms";

const renderers = [
  ...materialRenderers
];

type DetailViewFormProps<T> = {
} & Partial<JsonFormsInitStateProps & JsonFormsReactProps>

const DetailViewForm = <T, >({initialData, ...props}: DetailViewFormProps) => {
  const {t, i18n: {language, exists}} = useTranslation()
  const [ajv] = useState(createAjv({strictRequired: false, allErrors: false}));

  const translator: Translator = (key, defaultMessage) => {
    return (exists(key) ? t(key) : (defaultMessage && exists(defaultMessage) ? t(defaultMessage) : defaultMessage) || '')
  }

  const i18n: JsonFormsI18nState = {
    locale: language,
    translate: translator
  }
  return (
    <JsonForms
      renderers={renderers}
      cells={materialCells}
      i18n={i18n}
      ajv={ajv}
      {...props}
    />
  );
};

export default DetailViewForm;
