import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { CloverConnector } from '@clover-network/clover-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { LatticeConnector } from '@web3-react/lattice-connector'
import { KeystoneConnector } from '@keystonehq/keystone-connector'
import { ChainId } from './chainId'

import RPC from './rpc'

const supportedChainIds = Object.values(ChainId) as number[]

const POLLING_INTERVAL = 12000

export const injected = new InjectedConnector({ supportedChainIds: supportedChainIds })

export const walletconnect = new WalletConnectConnector({
  rpc: RPC,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds
})

export const walletlink = new WalletLinkConnector({
  url: process.env.ALCHEMY_KEY,
  appName: 'web3-react example'
})

// Key created at dashboard.formatic.com
export const fortmatic = new FortmaticConnector({ apiKey: 'pk_test_01F81B9AF084832D' as string, chainId: 1 })

// Key created at darshboard.portis.io
export const portis = new PortisConnector({ dAppId: 'cf782480-e9eb-4568-bb49-1a96a6801a10' as string, networks: [1] })

export const torus = new TorusConnector({ chainId: 1 })

export const clover = new CloverConnector({ supportedChainIds: [1, 3] })

// It only connects to Binance Smart Chain Network (as in Sushi)
export const binance = new BscConnector({ supportedChainIds: [56] })

export const lattice = new LatticeConnector({
  chainId: 1,
  url: RPC[ChainId.ETHEREUM],
  appName: 'AltaFin'
})

export const keystone = new KeystoneConnector({
  chainId: 1,
  url: RPC[ChainId.ETHEREUM]
})
