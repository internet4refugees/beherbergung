import dynamic from "next/dynamic"

/** The component uses Leaflet, which is using the `windows` object.
 *  This is not available with SSR (during development).
 *  Solution:
 *  https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
 **/
export const LeafletMapWithoutSSR = dynamic(() => import("./LeafletMap"), {
    ssr: false
  })
