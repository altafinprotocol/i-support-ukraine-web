import { createWeb3ReactRoot } from '@web3-react/core'
// import { NetworkContextName } from 'app/constants'

export const NetworkContextName = 'NETWORK'

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName)

function Web3ProviderNetwork ({ children, getLibrary }) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>
}

export default Web3ProviderNetwork
