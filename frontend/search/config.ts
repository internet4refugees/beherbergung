import * as default_config from './public/config.json'

export let config = default_config  /** to infer the types **/
let config_fetched = false

export async function fetch_config () {
  if(!config_fetched) {
    await fetch("/config.json").then(async res => {config = await res.json()
                                                   config_fetched = true})
  }
}
