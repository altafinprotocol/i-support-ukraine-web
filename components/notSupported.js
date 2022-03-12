import React, { useState, useEffect } from 'react'
import get from 'lodash/get'
import upperFirst from 'lodash/upperFirst'

import networkName from '../helpers/web3/networkName'

function NotSupported (props) {
  const {
    page,
    chainId,
    network,
    service
  } = props
  const [net, setNet] = useState('')
  const setNetwork = async () => {
    const x = await networkName(chainId)
    setNet(x)
  }
  useEffect(() => {
    setNetwork()
  }, [])
  return (
    <div className='mw-100 mh-100 global-wrapper d-flex align-items-center justify-content-center x-card-none'>
      <div className='container'>
        <h2 className='text-center p-0 m-0'>{upperFirst(net)} {get(page, 'notSupported.content.title', '')}</h2>
        <h5 className='text-center p-0 mt-5'>{get(page, 'notSupported.content.subTitle', '')}</h5>
        <div className='d-flex w-100 align-items-center justify-content-center mt-3'>
          {get(network, `ethereum.services[${service}]`) && <span className='supported-network'><img src='/networks/ethereum.png' className='img-network' />Ethereum</span>}
          {get(network, `ropsten.services[${service}]`) && <span className='supported-network'><img src='/networks/ropsten.png' className='img-network' />Ropsten</span>}
          {get(network, `polygon.services[${service}]`) && <span className='supported-network'><img src='/networks/polygon.png' className='img-network' />Polygon</span>}
          {get(network, `mumbai.services[${service}]`) && <span className='supported-network'><img src='/networks/mumbai.png' className='img-network' />Mumbai</span>}
          {get(network, `bsc.services[${service}]`) && <span className='supported-network'><img src='/networks/bsc.png' className='img-network' />Binance</span>}
          {get(network, `avalanche.services[${service}]`) && <span className='supported-network'><img src='/networks/avalance.png' className='img-network' />Avalance</span>}
          {get(network, `arbitrum.services[${service}]`) && <span className='supported-network'><img src='/networks/arbitrum.png' className='img-network' />Arbitrum</span>}
          {get(network, `optimism.services[${service}]`) && <span className='supported-network'><img src='/networks/optimism.png' className='img-network' />Optimism</span>}
          {get(network, `stacks.services[${service}]`) && <span className='supported-network'><img src='/networks/stacks.png' className='img-network' />Stacks</span>}
          {get(network, `solana.services[${service}]`) && <span className='supported-network'><img src='/networks/solana.png' className='img-network' />Solana</span>}
        </div>
      </div>
    </div>
  )
}

export default NotSupported
