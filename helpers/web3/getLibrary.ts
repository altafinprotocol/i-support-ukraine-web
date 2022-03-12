import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from './chainId'
// declare enum ChainId {
//     ETHEREUM = 1,
//     ROPSTEN = 3,
//     RINKEBY = 4,
//     GÖRLI = 5,
//     KOVAN = 42,
//     MATIC = 137,
//     MATIC_TESTNET = 80001,
//     FANTOM = 250,
//     FANTOM_TESTNET = 4002,
//     XDAI = 100,
//     BSC = 56,
//     BSC_TESTNET = 97,
//     ARBITRUM = 42161,
//     ARBITRUM_TESTNET = 79377087078960,
//     MOONBEAM_TESTNET = 1287,
//     AVALANCHE = 43114,
//     AVALANCHE_TESTNET = 43113,
//     HECO = 128,
//     HECO_TESTNET = 256,
//     HARMONY = 1666600000,
//     HARMONY_TESTNET = 1666700000,
//     OKEX = 66,
//     OKEX_TESTNET = 65,
//     CELO = 42220,
//     PALM = 11297108109,
//     PALM_TESTNET = 11297108099,
//     MOONRIVER = 1285,
//     FUSE = 122,
//     TELOS = 40,
//     HARDHAT = 31337
// }

const NETWORK_POLLING_INTERVALS: { [chainId: number]: number } = {
  42161: 1_000,
  79377087078960: 1_000,
  1666600000: 15_000
}

export default function getLibrary (provider: any): Web3Provider {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
        ? parseInt(provider.chainId)
        : 'any'
  )
  library.pollingInterval = 15_000
  library.detectNetwork().then((network) => {
    const networkPollingInterval = NETWORK_POLLING_INTERVALS[network.chainId]
    if (networkPollingInterval) {
      console.debug('Setting polling interval', networkPollingInterval)
      library.pollingInterval = networkPollingInterval
    }
  })
  return library
}
