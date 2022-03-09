import { gql } from 'graphql-request'

export const login = gql`
  query Login($auth: Auth!) {
    login(auth: $auth) {jwt}
  }`

export const get_offers = gql`
  query GetOffers($auth: Auth!) {
    get_offers(auth: $auth) {
      accessible
      note
    }
  }`
