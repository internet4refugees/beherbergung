import { useQuery, UseQueryOptions } from 'react-query';
import { fetcher } from './fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The 'Long' scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^64) and 2^64 - 1. */
  Long: any;
};

export type Array2string = {
  __typename?: 'Array2string';
  join?: Maybe<Scalars['String']>;
};

/** Authentication requires either a valid mail+password combination or a jwt obtained by an earlier login. */
export type Auth = {
  /** Self descriptive. */
  jwt: Scalars['String'];
  /** Self descriptive. */
  mail: Scalars['String'];
  /** Self descriptive. */
  password: Scalars['String'];
};

/** convert a string date to iso format or other string formats */
export type Date2Iso = {
  __typename?: 'Date2Iso';
  inputDateFormat?: Maybe<Scalars['String']>;
};

/** option that influences the default filter option for a column */
export type Filter = {
  __typename?: 'Filter';
  operator?: Maybe<Scalars['String']>;
};

/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationType = {
  __typename?: 'MutationType';
  write_rw?: Maybe<Scalars['Boolean']>;
};


/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationTypeWrite_RwArgs = {
  auth: Auth;
  onEditCompleteByType: OnEditCompleteByType;
};

/** https://reactdatagrid.io/docs/api-reference#props-onEditComplete */
export type OnEditCompleteByType = {
  /** Self descriptive. */
  columnId: Scalars['String'];
  /** Self descriptive. */
  rowId: Scalars['String'];
  value_boolean?: InputMaybe<Scalars['Boolean']>;
  value_string?: InputMaybe<Scalars['String']>;
};

export type Options = {
  __typename?: 'Options';
  /** needed  for date-strings, in order to make filter understand what date format the date string has */
  dateFormat?: Maybe<Scalars['String']>;
  filter?: Maybe<Filter>;
  transform?: Maybe<Transform>;
};

/** The type that query operations will be rooted at. */
export type QueryType = {
  __typename?: 'QueryType';
  /** Export an encrypted database dump */
  export?: Maybe<Export>;
  get_columns?: Maybe<Array<Get_Columns>>;
  /** The offers that are visible for the ngo, belonging to the login */
  get_offers?: Maybe<Array<Get_Offers>>;
  get_rw?: Maybe<Array<Get_Rw>>;
  /** For a username+password get a jwt containing the login:id */
  login: Login;
};


/** The type that query operations will be rooted at. */
export type QueryTypeExportArgs = {
  password: Scalars['String'];
};


/** The type that query operations will be rooted at. */
export type QueryTypeGet_ColumnsArgs = {
  auth: Auth;
};


/** The type that query operations will be rooted at. */
export type QueryTypeGet_OffersArgs = {
  auth: Auth;
};


/** The type that query operations will be rooted at. */
export type QueryTypeGet_RwArgs = {
  auth: Auth;
};


/** The type that query operations will be rooted at. */
export type QueryTypeLoginArgs = {
  auth: Auth;
};

export type Transform = {
  __typename?: 'Transform';
  array2string?: Maybe<Array2string>;
  date2Iso?: Maybe<Date2Iso>;
};

/** Export an encrypted database dump */
export type Export = {
  __typename?: 'export';
  err?: Maybe<Scalars['String']>;
  /** Self descriptive. */
  exit: Scalars['Int'];
  out?: Maybe<Scalars['String']>;
};

export type Get_Columns = {
  __typename?: 'get_columns';
  defaultWidth?: Maybe<Scalars['Int']>;
  editable?: Maybe<Scalars['Boolean']>;
  group?: Maybe<Scalars['String']>;
  /** The displayed name of the column (before translation) */
  header: Scalars['String'];
  /** The identifier of the column */
  name: Scalars['String'];
  options?: Maybe<Options>;
  /** The type, deliverd to reactdatagrid (after transformation) */
  type: Scalars['String'];
};

/** The offers that are visible for the ngo, belonging to the login */
export type Get_Offers = {
  __typename?: 'get_offers';
  accessible?: Maybe<Scalars['Boolean']>;
  animals_allowed?: Maybe<Scalars['Boolean']>;
  animals_present?: Maybe<Scalars['Boolean']>;
  beds?: Maybe<Scalars['Int']>;
  contact_email?: Maybe<Scalars['String']>;
  contact_name_full?: Maybe<Scalars['String']>;
  contact_phone?: Maybe<Scalars['String']>;
  covid_vaccinated?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  editor?: Maybe<Scalars['String']>;
  /** Self descriptive. */
  id: Scalars['String'];
  id_tmp?: Maybe<Scalars['String']>;
  kids_suitable?: Maybe<Scalars['Boolean']>;
  languages?: Maybe<Array<Scalars['String']>>;
  note?: Maybe<Scalars['String']>;
  pickup?: Maybe<Scalars['Boolean']>;
  place_city?: Maybe<Scalars['String']>;
  place_country?: Maybe<Scalars['String']>;
  place_lat?: Maybe<Scalars['Float']>;
  place_lon?: Maybe<Scalars['Float']>;
  place_street?: Maybe<Scalars['String']>;
  place_street_number?: Maybe<Scalars['String']>;
  place_zip?: Maybe<Scalars['String']>;
  rw_contact_replied?: Maybe<Scalars['String']>;
  rw_contacted?: Maybe<Scalars['String']>;
  rw_note?: Maybe<Scalars['String']>;
  rw_offer_occupied?: Maybe<Scalars['String']>;
  skills_translation?: Maybe<Scalars['Boolean']>;
  source?: Maybe<Scalars['String']>;
  time_duration_str?: Maybe<Scalars['String']>;
  time_from_str?: Maybe<Scalars['String']>;
  time_submission_str?: Maybe<Scalars['String']>;
};

export type Get_Rw = {
  __typename?: 'get_rw';
  accessible?: Maybe<Scalars['Boolean']>;
  animals_allowed?: Maybe<Scalars['Boolean']>;
  animals_present?: Maybe<Scalars['Boolean']>;
  beds?: Maybe<Scalars['Int']>;
  contact_email?: Maybe<Scalars['String']>;
  contact_name_full?: Maybe<Scalars['String']>;
  contact_phone?: Maybe<Scalars['String']>;
  covid_vaccinated?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  edit_date?: Maybe<Scalars['String']>;
  editor?: Maybe<Scalars['String']>;
  /** Self descriptive. */
  id: Scalars['String'];
  kids_suitable?: Maybe<Scalars['Boolean']>;
  languages?: Maybe<Array<Scalars['String']>>;
  note?: Maybe<Scalars['String']>;
  pickup?: Maybe<Scalars['Boolean']>;
  place_city?: Maybe<Scalars['String']>;
  place_country?: Maybe<Scalars['String']>;
  place_lat?: Maybe<Scalars['Float']>;
  place_lon?: Maybe<Scalars['Float']>;
  place_street?: Maybe<Scalars['String']>;
  place_street_number?: Maybe<Scalars['String']>;
  place_zip?: Maybe<Scalars['String']>;
  rw_contact_replied?: Maybe<Scalars['String']>;
  rw_contacted?: Maybe<Scalars['String']>;
  rw_note?: Maybe<Scalars['String']>;
  rw_offer_occupied?: Maybe<Scalars['String']>;
  skills_translation?: Maybe<Scalars['Boolean']>;
  time_duration_str?: Maybe<Scalars['String']>;
  time_from_str?: Maybe<Scalars['String']>;
};

/** For a username+password get a jwt containing the login:id */
export type Login = {
  __typename?: 'login';
  jwt?: Maybe<Scalars['String']>;
};

export type LoginQueryVariables = Exact<{
  auth: Auth;
}>;


export type LoginQuery = { __typename?: 'QueryType', login: { __typename?: 'login', jwt?: string | null } };

export type GetColumnsQueryVariables = Exact<{
  auth: Auth;
}>;


export type GetColumnsQuery = { __typename?: 'QueryType', get_columns?: Array<{ __typename?: 'get_columns', name: string, type: string, header: string, group?: string | null, defaultWidth?: number | null, editable?: boolean | null, options?: { __typename?: 'Options', dateFormat?: string | null, filter?: { __typename?: 'Filter', operator?: string | null } | null, transform?: { __typename?: 'Transform', date2Iso?: { __typename?: 'Date2Iso', inputDateFormat?: string | null } | null, array2string?: { __typename?: 'Array2string', join?: string | null } | null } | null } | null }> | null };

export type GetOffersQueryVariables = Exact<{
  auth: Auth;
}>;


export type GetOffersQuery = { __typename?: 'QueryType', get_offers?: Array<{ __typename?: 'get_offers', id: string, id_tmp?: string | null, source?: string | null, time_submission_str?: string | null, editor?: string | null, rw_contacted?: string | null, rw_offer_occupied?: string | null, time_from_str?: string | null, time_duration_str?: string | null, beds?: number | null, languages?: Array<string> | null, place_country?: string | null, place_city?: string | null, place_zip?: string | null, place_street?: string | null, place_street_number?: string | null, place_lon?: number | null, place_lat?: number | null, skills_translation?: boolean | null, kids_suitable?: boolean | null, accessible?: boolean | null, animals_allowed?: boolean | null, animals_present?: boolean | null, covid_vaccinated?: boolean | null, pickup?: boolean | null, contact_name_full?: string | null, contact_phone?: string | null, contact_email?: string | null, note?: string | null, description?: string | null }> | null };

export type GetRwQueryVariables = Exact<{
  auth: Auth;
}>;


export type GetRwQuery = { __typename?: 'QueryType', get_rw?: Array<{ __typename?: 'get_rw', id: string, editor?: string | null, edit_date?: string | null, rw_contacted?: string | null, rw_contact_replied?: string | null, rw_offer_occupied?: string | null, rw_note?: string | null, time_from_str?: string | null, time_duration_str?: string | null, beds?: number | null, languages?: Array<string> | null, place_country?: string | null, place_city?: string | null, place_zip?: string | null, place_street?: string | null, place_street_number?: string | null, place_lon?: number | null, place_lat?: number | null, skills_translation?: boolean | null, kids_suitable?: boolean | null, accessible?: boolean | null, animals_allowed?: boolean | null, animals_present?: boolean | null, covid_vaccinated?: boolean | null, pickup?: boolean | null, contact_name_full?: string | null, contact_phone?: string | null, contact_email?: string | null, note?: string | null, description?: string | null }> | null };


export const LoginDocument = `
    query Login($auth: Auth!) {
  login(auth: $auth) {
    jwt
  }
}
    `;
export const useLoginQuery = <
      TData = LoginQuery,
      TError = unknown
    >(
      variables: LoginQueryVariables,
      options?: UseQueryOptions<LoginQuery, TError, TData>
    ) =>
    useQuery<LoginQuery, TError, TData>(
      ['Login', variables],
      fetcher<LoginQuery, LoginQueryVariables>(LoginDocument, variables),
      options
    );
export const GetColumnsDocument = `
    query GetColumns($auth: Auth!) {
  get_columns(auth: $auth) {
    name
    type
    header
    group
    defaultWidth
    editable
    options {
      filter {
        operator
      }
      dateFormat
      transform {
        date2Iso {
          inputDateFormat
        }
        array2string {
          join
        }
      }
    }
  }
}
    `;
export const useGetColumnsQuery = <
      TData = GetColumnsQuery,
      TError = unknown
    >(
      variables: GetColumnsQueryVariables,
      options?: UseQueryOptions<GetColumnsQuery, TError, TData>
    ) =>
    useQuery<GetColumnsQuery, TError, TData>(
      ['GetColumns', variables],
      fetcher<GetColumnsQuery, GetColumnsQueryVariables>(GetColumnsDocument, variables),
      options
    );
export const GetOffersDocument = `
    query GetOffers($auth: Auth!) {
  get_offers(auth: $auth) {
    id
    id_tmp
    source
    time_submission_str
    editor
    rw_contacted
    rw_offer_occupied
    time_from_str
    time_duration_str
    beds
    languages
    place_country
    place_city
    place_zip
    place_street
    place_street_number
    place_lon
    place_lat
    skills_translation
    kids_suitable
    accessible
    animals_allowed
    animals_present
    covid_vaccinated
    pickup
    contact_name_full
    contact_phone
    contact_email
    note
    description
  }
}
    `;
export const useGetOffersQuery = <
      TData = GetOffersQuery,
      TError = unknown
    >(
      variables: GetOffersQueryVariables,
      options?: UseQueryOptions<GetOffersQuery, TError, TData>
    ) =>
    useQuery<GetOffersQuery, TError, TData>(
      ['GetOffers', variables],
      fetcher<GetOffersQuery, GetOffersQueryVariables>(GetOffersDocument, variables),
      options
    );
export const GetRwDocument = `
    query GetRw($auth: Auth!) {
  get_rw(auth: $auth) {
    id
    editor
    edit_date
    rw_contacted
    rw_contact_replied
    rw_offer_occupied
    rw_note
    time_from_str
    time_duration_str
    beds
    languages
    place_country
    place_city
    place_zip
    place_street
    place_street_number
    place_lon
    place_lat
    skills_translation
    kids_suitable
    accessible
    animals_allowed
    animals_present
    covid_vaccinated
    pickup
    contact_name_full
    contact_phone
    contact_email
    note
    description
  }
}
    `;
export const useGetRwQuery = <
      TData = GetRwQuery,
      TError = unknown
    >(
      variables: GetRwQueryVariables,
      options?: UseQueryOptions<GetRwQuery, TError, TData>
    ) =>
    useQuery<GetRwQuery, TError, TData>(
      ['GetRw', variables],
      fetcher<GetRwQuery, GetRwQueryVariables>(GetRwDocument, variables),
      options
    );