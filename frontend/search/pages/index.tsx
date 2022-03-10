import type { NextPage } from 'next'
import Head from 'next/head'
import HostOfferLookupWrapper from '../components/ngo/HostOfferLookupWrapper'
import styles from '../styles/Home.module.css'
import { useTranslation } from 'react-i18next'

const Home: NextPage = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <Head>
        <title>{ t('Beherbergungssuche') }</title>
        <meta name="description" content={ t('Beherbergungssuche') } />
      </Head>

      <main className={styles.main}>
        <HostOfferLookupWrapper />
      </main>

    </div>
  )
}

export default Home
