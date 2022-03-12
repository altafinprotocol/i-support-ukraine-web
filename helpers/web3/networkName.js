export default function networkName (chainId) {
  let networkName = ''
  switch (chainId) {
    case '0x1':
    case 1: {
      networkName = 'ethereum'
      break
    }
    case 42:
    case '0x2a': {
      networkName = 'kovan'
      break
    }
    case 3:
    case '0x3': {
      networkName = 'ropsten'
      break
    }
    case 4:
    case '0x4': {
      networkName = 'rinkeby'
      break
    }
    case 5:
    case '0x5': {
      networkName = 'goerli'
      break
    }
    case 137:
    case '0x89': {
      networkName = 'polygon'
      break
    }
    case 80001: {
      networkName = 'mumbai'
      break
    }
    case 250: {
      networkName = 'fantom'
      break
    }
    case 4002: {
      networkName = 'fantom testnet'
      break
    }
    case 100: {
      networkName = 'xdai'
      break
    }
    case 56: {
      networkName = 'binance smart chain'
      break
    }
    case 97: {
      networkName = 'bsc testnet'
      break
    }
    case 42161: {
      networkName = 'arbitrum'
      break
    }
    case 79377087078960: {
      networkName = 'arbitrum testnet'
      break
    }
    case 1287: {
      networkName = 'moonbeam testnet'
      break
    }
    case 43114: {
      networkName = 'avalanche'
      break
    }
    case 43113: {
      networkName = 'avalanche testnet'
      break
    }
    case 128: {
      networkName = 'heco'
      break
    }
    case 256: {
      networkName = 'heco testnet'
      break
    }
    case 1666600000: {
      networkName = 'harmony'
      break
    }
    case 1666700000: {
      networkName = 'harmony testnet'
      break
    }
    case 66: {
      networkName = 'okex'
      break
    }
    case 65: {
      networkName = 'okex testnet'
      break
    }
    case 42220: {
      networkName = 'celo'
      break
    }
    case 11297108109: {
      networkName = 'palm'
      break
    }
    case 11297108099: {
      networkName = 'palm testnet'
      break
    }
    case 1285: {
      networkName = 'moonriver'
      break
    }
    case 122: {
      networkName = 'fuse'
      break
    }
    case 40: {
      networkName = 'telos'
      break
    }
    default: {}
  }
  return networkName
}
