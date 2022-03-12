import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import log from 'ololog'

export async function ethereumGetCurrentBlock () {
  try {
    const alchemyUrl = process.env.ALCHEMY_ENDPOINT + process.env.ALCHEMY_KEY
    const web3 = createAlchemyWeb3(alchemyUrl)
    const blockNumber = await web3.eth.getBlockNumber()
    return blockNumber
  } catch (e) {
    log.yellow(e)
  }
}
