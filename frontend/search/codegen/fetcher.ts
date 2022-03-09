import {config, fetch_config} from "../config";

export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    await fetch_config()
    const res = await fetch(`${config.backend_base_url}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),

      headers: {
        'Content-Type': 'application/json',
      }

    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];
      console.error('Graphql Error:', message, query, variables)
    }

    return json.data;
  }
}
