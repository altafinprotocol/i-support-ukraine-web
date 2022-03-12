import React from 'react'

function Index (props) {
  return (
    <div />
  )
}

export async function getServerSideProps (context) {
  const { req, res } = context
  if (req.url === '/') {
    res.setHeader('location', '/mint')
    res.statusCode = 302
    res.end()
  }
  return { props: {} }
}

export default Index
