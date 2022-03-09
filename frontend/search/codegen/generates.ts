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

/** Authentication requires either a valid mail+password combination or a jwt obtained by an earlier login. */
export type Auth = {
  /** Self descriptive. */
  jwt: Scalars['String'];
  /** Self descriptive. */
  mail: Scalars['String'];
  /** Self descriptive. */
  password: Scalars['String'];
};

/** The type that query operations will be rooted at. */
export type QueryType = {
  __typename?: 'QueryType';
  /** Export an encrypted database dump */
  export?: Maybe<Export>;
  /** The offers that are visible for the ngo, belonging to the login */
  get_offers?: Maybe<Array<Get_Offers>>;
  /** For a username+password get a jwt containing the login:id */
  login: Login;
};


/** The type that query operations will be rooted at. */
export type QueryTypeExportArgs = {
  password: Scalars['String'];
};


/** The type that query operations will be rooted at. */
export type QueryTypeGet_OffersArgs = {
  auth: Auth;
};


/** The type that query operations will be rooted at. */
export type QueryTypeLoginArgs = {
  auth: Auth;
};

/** Export an encrypted database dump */
export type Export = {
  __typename?: 'export';
  err?: Maybe<Scalars['String']>;
  /** Self descriptive. */
  exit: Scalars['Int'];
  out?: Maybe<Scalars['String']>;
};

/** The offers that are visible for the ngo, belonging to the login */
export type Get_Offers = {
  __typename?: 'get_offers';
  accessible?: Maybe<Scalars['Boolean']>;
  note?: Maybe<Scalars['String']>;
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

export type GetOffersQueryVariables = Exact<{
  auth: Auth;
}>;


export type GetOffersQuery = { __typename?: 'QueryType', get_offers?: Array<{ __typename?: 'get_offers', accessible?: boolean | null, note?: string | null }> | null };


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
export const GetOffersDocument = `
    query GetOffers($auth: Auth!) {
  get_offers(auth: $auth) {
    accessible
    note
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