import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import MyQueryClientProvider from "../components/QueryClientProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return <MyQueryClientProvider>
    <Component {...pageProps} />
  </MyQueryClientProvider>
}

export default MyApp
