import {ColumnRaw} from "../util/datagrid/columnRaw";

const columnsRaw: ColumnRaw[] = [
  {
    "name": "rw_contacted",
    "group": "contactStatus",
    "header": "Asked",
    "type": "boolean",
    "editable": true,
    "defaultWidth": 85
  },
  {
    "name": "rw_contact_replied",
    "group": "contactStatus",
    "header": "Answered",
    "type": "boolean",
    "editable": true,
    "defaultWidth": 110
  },
  {
    "name": "rw_offer_occupied",
    "group": "offerStatus",
    "header": "Occupied",
    "type": "boolean",
    "editable": true,
    "defaultWidth": 110
  },
  {
    "name": "rw_note",
    "header": "Our notes",
    "type": "string",
    "editable": true,
    "defaultWidth": 400
  },
  {
    "name": "place_distance",
    "group": "distance",
    "header": "km",
    "type": "number",
    "defaultWidth": 105
  },
  {
    "name": "place_country",
    "group": "locationCoarse",
    "header": "Country",
    "type": "string",
    "defaultWidth": 10
  },
  {
    "name": "place_city",
    "group": "locationCoarse",
    "header": "City",
    "type": "string"
  },
  {
    "name": "beds",
    "header": "Beds",
    "type": "number"
  },
  {
    "name": "time_from_str",
    "group": "time",
    "header": "From",
    "type": "date",
    "defaultWidth": 90,
    "options": {
      "dateFormat": "MM/DD/YYYY",
      "transform": {
        "date2Iso": {
          "inputDateFormat": "MM/DD/YYYY"
        }
      }
    }
  },
  {
    "name": "time_duration_str",
    "group": "time",
    "header": "Duration",
    "type": "string"
  },
  {
    "name": "languages",
    "header": "Languages",
    "type": "object",
    "defaultWidth": 200,
    "options": {
      "transform": {
        array2string: {
          join: ","
        }
      }
    }
  },
  {
    "name": "accessible",
    "group": "features",
    "header": "Accessible",
    "type": "boolean",
    "defaultWidth": 120
  },
  {
    "name": "animals_allowed",
    "group": "animals",
    "header": "Allowed",
    "type": "boolean",
    "defaultWidth": 100
  },
  {
    "name": "animals_present",
    "group": "animals",
    "header": "Present",
    "type": "boolean",
    "defaultWidth": 95
  },
  {
    "name": "note",
    "header": "User comment",
    "type": "string",
    "defaultWidth": 400
  },
  {
    "name": "contact_name_full",
    "group": "contact",
    "header": "Name",
    "type": "string"
  },
  {
    "name": "contact_phone",
    "group": "contact",
    "header": "Phone",
    "type": "string"
  },
  {
    "name": "contact_email",
    "group": "contact",
    "header": "EMail",
    "type": "string"
  },
  {
    "name": "place_street",
    "group": "address",
    "header": "Street",
    "type": "string"
  },
  {
    "name": "place_street_number",
    "group": "address",
    "header": "Number",
    "type": "string",
    "defaultWidth": 100
  },
  {
    "name": "place_zip",
    "group": "address",
    "header": "Zip",
    "type": "string",
    "defaultWidth": 80
  },
]


export default columnsRaw
