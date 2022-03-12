/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { Provider } from 'react-redux'
import App from 'next/app'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withRedux from 'next-redux-wrapper'
import { Web3ReactProvider } from '@web3-react/core'
import Web3ReactManager from '../components/web3ReactManager'
import getLibrary from '../helpers/web3/getLibrary'
import '../stylesheets/index.scss'

import { makeStore } from '../redux'

import ModalWrapper from '../components/modal/modalWrapper'

const Web3ProviderNetwork = dynamic(() => import('../components/web3ProviderNetwork'), { ssr: false })
class Incite extends App {
  static async getInitialProps ({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    if (Object.keys(pageProps).length > 0) {
      return {
        pageProps
      }
    } else {
      return { }
    }
  }

  render () {
    const { Component, pageProps, store } = this.props
    const gtag = process.env.GOOGLE_ANALYTICS_ID
    return (
      <>
        <Head>
          <link rel='shortcut icon' href='/favicon.png' />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}
          />
          <script dangerouslySetInnerHTML={
            {
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments)}
                gtag("js", new Date());
                gtag("config", "${gtag}");
            `
          }
          }
          />
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <Provider store={store}>
                <ModalWrapper />
                <Component {...pageProps} />
              </Provider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </>
    )
  }
}

export default withRedux(makeStore)(Incite)
