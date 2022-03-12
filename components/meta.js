import React from 'react'
import get from 'lodash/get'
import Head from 'next/head'

function Meta (props) {
  return (
    <Head>
      <title>{`${get(props, 'title', '')}`}</title>
      <meta name='title' content={get(props, 'title', '')} />
      <meta name='description' content={get(props, 'description', '')} />
      <meta name='image' content={get(props, 'image', '')} />
      <meta name='video' content={get(props, 'video', '')} />
      <meta property='og:title' content={get(props, 'title', '')} />
      <meta property='og:url' content={get(props, 'url', '')} />
      <meta property='og:description' content={get(props, 'description', '')} />
      <meta property='og:image' content={get(props, 'image', '')} />
      <meta property='og:video' content={get(props, 'video', '')} />
    </Head>
  )
}

export default Meta
